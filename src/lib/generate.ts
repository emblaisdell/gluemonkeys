import { get } from "svelte/store";
import { description, questions, code } from "./stores";
import { getCompletion } from "./completion";

// This is where the magic happens
export async function attempt() {
    code.set("")

    const ready_to_go_prompt = `
${task()}
${questionAnswers()}

Yes or no, are there more questions you need answers to before writing the code?  Note that this includes all of the specifics including API URLs and API keys.

Are there environment variables that you would need to know the value of?
`
    const readyResp = await getCompletion(ready_to_go_prompt)
    const ready = readyResp === "No"
    
    if(ready) {
        await generate()
    } else {
        await followUp()
    }    
}


// Answer more questions
async function followUp() {
    const get_questions_prompt = `
${task()}
${questionAnswers()}

What ${anyAnswers() ? "further " : ""}questions do you need to have answered before writing the code?

Don't ask Python-specific questions; you can make whatever decisions you want and use any libraries.

Please also ask for the values of environment variables you would need, such as API keys or sender/receiver emails.

Please infer API endpoints with your best judgement.

Please write the questions as a * bulletted list.
`
    const newQResp = await getCompletion(get_questions_prompt)
    const newQs = questionsFromResponse(newQResp!)

    console.log("Qs:",newQResp)
    console.log("Q List:",newQs)

    questions.update((oldQs)=>([
        ...oldQs,
        ...newQs.map(q=>({
            question:q, answer:""
        }))
    ]))
}

// actually generate the code
async function generate() {
    const generate_prompt = `
${task()}
${questionAnswers()}

Please infer API endpoints with your best judgement.

Please write working Python code and extract all environment variables to a .env file.
`

    const pythonCode = await getCompletion(generate_prompt)
    console.log("Python code:",pythonCode)
    code.set(pythonCode!)
}

function anyAnswers(): boolean {
    return get(questions).length > 0
}

function task(): string {
    return `
I want to do the following:

"""
${get(description)}
"""

We are writing Python code to solve this problem . It will be run on a local server which is always running.

`
}

function questionAnswers(): string {
    return !anyAnswers() ? "" : `
Here are answers to some relevant questions:

${get(questions).map(({question,answer})=>`Q: ${question}\nA:${answer}\n\n`)}

`
}


function questionsFromResponse(resp: string): string[] {
    const regex = /\*(.*)\n/g

    let matches: string[] = [];
    let match;

    while ((match = regex.exec(resp)) !== null) {
        matches.push(match[1]);
    }

    // console.log(matches); // Output: [ 'over' ]

    return matches
}