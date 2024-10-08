import React, { useState } from "react";
import axios from "axios";
function Hero(props) {
  const [formData, setFormData] = useState({ youtubeLink: "" });
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);

  const extractVideoId = (youtubeLink) => {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = youtubeLink.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setDownloading(true);
    setError(null);

    try {
      const videoId = extractVideoId(formData.youtubeLink);
      if (!videoId) {
        throw new Error("Invalid YouTube link");
      }
      const url1 = `https://ytmd.20032003.xyz/download?link=${videoId}`;
      
      const response = await axios({
        method: 'get',
        url: url1,
        responseType: 'blob'
      });
    
      if (response.status !== 200) {
        throw new Error("Download failed");
      }
    
      const blob = new Blob([response.data], { type: 'audio/mpeg' });
      const url = window.URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (error) {
      console.error("Error downloading audio:", error);
      setError("Failed to download audio. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  return (
    <main
      className={`px-4 py-2 flex flex-col items-center ${
        props.darkMode ? "bg-slate-950" : "bg-zinc-100"
      }`}
    >
      <div
        className={`flex flex-col items-center justify-center w-full max-w-md p-6 mt-6 rounded-lg shadow-lg ${
          props.darkMode
            ? "bg-slate-700 text-white shadow-slate-300"
            : "bg-white text-slate-700 shadow-gray-300"
        }`}
      >
        <img
          src={"./heart2.svg"}
          alt="Music Note"
          className="mb-4 w-16 h-16 transition-transform transform hover:scale-125 focus:outline-none focus:ring-4"
        />
        <h2 className="text-2xl font-semibold mb-4">
          {props.darkMode
            ? "Download Your Music in Style"
            : "Download Your Favorite Music"}
          {downloading && (
            <div className="flex items-center justify-center mt-6">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-blue-400 border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent opacity-50 animate-ping"></div>
                <p className="absolute inset-0 flex items-center justify-center text-blue-500 font-semibold">
                  Loading...
                </p>
              </div>
            </div>
          )}
        </h2>
        <form onSubmit={handleSubmit} className="w-full">
          <input
            type="text"
            name="youtubeLink"
            placeholder="Enter YouTube link"
            value={formData.youtubeLink}
            onChange={handleChange}
            className={`w-full p-3 mb-4 rounded-lg shadow focus:outline-none focus:ring-2 ${
              props.darkMode
                ? "bg-slate-600 border-slate-500 text-white focus:ring-blue-500"
                : "bg-white border-gray-300 text-slate-700 focus:ring-blue-500"
            }`}
          />
          <button
            type="submit"
            disabled={downloading}
            className={`w-full py-3 font-semibold rounded-lg shadow transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 ${
              props.darkMode
                ? "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-400"
                : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-400"
            }`}
          >
            {downloading ? "🚀 Let Rocket Do its 🚀" : "🫣Letss'Go👩🏻‍🦰"}
          </button>
        </form>
        {audioUrl && (
          <div className="mt-6 w-full text-center items-center">
            <audio controls src={audioUrl} className="w-full mb-4"></audio>
            <a
              href={audioUrl}
              download="audio.mp3"
              className="inline-block px-4 py-2 text-center items-center bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
            >
              Download Audio
            </a>
          </div>
        )}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </main>
  );
}

export default Hero;
