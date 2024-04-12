import { writable, type Writable } from "svelte/store";

export const description = writable("Send an email to via my company's SendGrid every time a new row is added to the \"Sales Leads\" Google Sheet")
export const questions = writable<{
    question: string,
    answer: string
}[]>([])
export const code = writable("")

// (["How big is the internet?","And how much does it weigh?"].map(q=>({
//     question: q,
//     answer: ""
// })))
