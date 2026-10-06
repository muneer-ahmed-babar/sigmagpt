import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";
import blackLogo from "./assets/blacklogo.jpg";

function Sidebar() {
    const { allThreads, setAllThreads, currThreadId, reply, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats } = useContext(MyContext);

    // Loads all threads from the backend and keeps only the id and title for the sidebar list
    const getAllThreads = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/thread");
            const res = await response.json();
            const filteredData = res.map(thread => ({ threadId: thread.threadId, title: thread.title }));
            setAllThreads(filteredData);
        } catch (err) {
            console.log(err);
        }
    };

    // Reload the list when the current chat changes or a new reply is saved, so a new thread shows up right away
    useEffect(() => {
        getAllThreads();
    }, [currThreadId, reply]);

    // Starts a fresh chat: clears the UI state and creates a new unique threadId
    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    };

    // Opens an old thread: fetches its messages from the backend and shows them in the chat window
    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);

        try {
            const response = await fetch(`http://localhost:5000/api/thread/${newThreadId}`);
            const res = await response.json();
            setPrevChats(res);
            setNewChat(false);
            setReply(null); // null means: show the old messages without the typing effect
        } catch (err) {
            console.log(err);
        }
    };

    // Deletes a thread in the DB, then removes it from the sidebar list without reloading
    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/thread/${threadId}`, { method: "DELETE" });
            const res = await response.json();
            console.log(res);

            // Updated list re-renders the sidebar
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

            // If the open chat was deleted, move to a new empty chat
            if (threadId === currThreadId) {
                createNewChat();
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <section className="sidebar">
            <button onClick={createNewChat}>
                <img src={blackLogo} alt="gpt logo" className="logo"></img>
                <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>

            <ul className="history">
                {
                    allThreads?.map((thread) => (
                        <li
                            key={thread.threadId}
                            onClick={() => changeThread(thread.threadId)}
                            className={thread.threadId === currThreadId ? "highlighted" : ""}
                        >
                            {thread.title}
                            <i
                                className="fa-solid fa-trash"
                                onClick={(e) => {
                                    e.stopPropagation(); // stop event bubbling, so the li onClick does not run
                                    deleteThread(thread.threadId);
                                }}
                            ></i>
                        </li>
                    ))
                }
            </ul>

            <div className="sign">
                <p>By ApnaCollege &hearts;</p>
            </div>
        </section>
    );
}

export default Sidebar;