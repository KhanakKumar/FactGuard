import React, { useEffect, useState} from 'react'

function Check () {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const response = await fetch("http://localhost:8080/api/home", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: inputValue }),
    });

    const data = await response.json();
    console.log("Backend Response:", data);
  };

  return (
    <main className="flex h-screen items-center">
        <form onSubmit={handleSubmit} className="w-screen mx-[110px]">
            <div className="flex h-[80px] bg-white rounded-[20px] drop-shadow-[0_0_10px_rgba(0,0,0,0.50)] items-center">
            <input
                    id="username"
                    name="username"
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder='Enter Url'
                    className="w-full h-[50px] px-[50px] text-gray-900 placeholder:text-gray-400 focus:outline-none text-4xl"
            />
            <button type='submit' className="w-1/6 h-[80px] rounded-[20px] bg-blue-500 hover:bg-blue-300 text-blue-50 text-4xl">Check</button>
            </div>
        </form>
    </main>
  )
};
export default Check