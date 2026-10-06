import "dotenv/config";

// Same structure as gemini.js. Only the key, URL and model are different
const getGroqAPIResponse = async (message) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
            model: "openai/gpt-oss-120b",
            messages: [{
                role: "user",
                content: message
            }]
        })
    };

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", options);
        const data = await response.json();

        if (!response.ok) {
            console.log("Groq error:", JSON.stringify(data));
            return null;
        }

        return data.choices[0].message.content; // reply
    } catch (err) {
        console.log(err);
        return null;
    }
}

export default getGroqAPIResponse;