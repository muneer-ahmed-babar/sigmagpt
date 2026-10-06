import "dotenv/config";

const getGeminiAPIResponse = async (message) => {
    // "options" holds the settings for the request we send to Gemini
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`
        },
        body: JSON.stringify({
            model: "gemini-3.5-flash",
            messages: [{
                role: "user",
                content: message
            }]
        })
    };

    try {
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", options);
        const data = await response.json();

        // Gemini errors (503, 429...) have no "choices", so log the real error and stop here
        if (!response.ok) {
            console.log("Gemini error:", JSON.stringify(data));
            return null;
        }

        return data.choices[0].message.content; // reply
    } catch (err) {
        console.log(err);
        return null;
    }
}

export default getGeminiAPIResponse;