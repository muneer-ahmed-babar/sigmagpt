import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";

function ChatWindow() {
    const { prompt, setPrompt, reply, setReply, currThreadId, setPrevChats, setNewChat } = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Sends the prompt and threadId to the backend and stores Gemini's reply in context
    const getReply = async () => {
        // Ignore empty messages
        if (!prompt.trim()) return;

        setLoading(true);

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId
            })
        };

        try {
            // Backend runs on port 5000 in this project (the video uses 8080)
            const response = await fetch("http://localhost:5000/api/chat", options);
            const res = await response.json();

            // The backend sends { error } (for example 502 when Gemini is busy) and no reply.
            // Stop here, otherwise the typing effect in Chat.jsx would crash on an undefined reply
            if (!response.ok) {
                console.log(res);
                return;
            }

            setNewChat(false);
            setReply(res.reply);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    // When a new reply arrives, add the user message and the reply to prevChats, then clear the input
    useEffect(() => {
        if (prompt && reply) {
            setPrevChats(prevChats => (
                [...prevChats, {
                    role: "user",
                    content: prompt
                }, {
                    role: "assistant",
                    content: reply
                }]
            ));
        }

        setPrompt("");
    }, [reply]);

    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="chatWindow">
            <div className="navbar">
                <span>SigmaGPT <i className="fa-solid fa-chevron-down"></i></span>
                <div className="userIconDiv" onClick={handleProfileClick}>
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>
            </div>
            {
                isOpen &&
                <div className="dropDown">
                    <div className="dropDownItem"><i className="fa-solid fa-gear"></i> Settings</div>
                    <div className="dropDownItem"><i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan</div>
                    <div className="dropDownItem"><i className="fa-solid fa-arrow-right-from-bracket"></i> Log out</div>
                </div>
            }
            <Chat></Chat>

            <ScaleLoader color="#fff" loading={loading}></ScaleLoader>

            <div className="chatInput">
                <div className="inputBox">
                    <input
                        placeholder="Ask anything"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" ? getReply() : ""}
                    ></input>
                    <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
                </div>
                <p className="info">SigmaGPT can make mistakes. Check important info. See Cookie Preferences.</p>
            </div>
        </div>
    );
}

export default ChatWindow;