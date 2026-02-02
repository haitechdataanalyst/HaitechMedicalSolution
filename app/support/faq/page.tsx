import { FAQ } from "@/components/misc";
import data from "@/data/faq.json"

export default function Faq(){
    return (
        <>
        <FAQ faqs={data.faqs} title="Frequently Asked Questions ?" subtitle="FAQ"  />
        </>
    )
}