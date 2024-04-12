<script lang="ts">
    import { getCompletion } from "$lib/completion";
    import { attempt } from "$lib/generate";
    import { questions, description, code } from "$lib/stores";

    // console.log(getCompletion("Tell me a joke."))
    function updateAnswer(i: number, answer: string) {
        questions.update(qs=>{
            const newQs = [...qs]
            newQs[i].answer = answer
            return newQs
        })
    }
</script>

<style>
    textarea {
        min-width: 50vw;
        min-height: 6em;
    }
</style>

<h1>Welcome to Glue Monkeys</h1>

<p>Describe the connection you want to make:</p>
<textarea placeholder="Send me an email every time... " bind:value={$description} />
<br/>

<ul>{#each $questions as {question,answer},i}
    <li><div>
        {question}<br/>
        <input value={answer} on:input={(e) => updateAnswer(i, e.target.value)} />
    </div></li>
{/each}</ul>

<code>{$code}</code>

<br/>

<button on:click={attempt}>Let's Go!</button>