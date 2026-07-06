import React, { useState } from "react";
import "../styles/components.css";
import searchIcon from "../assets/Search.png";

function SearchBar({ onSearch }) {
    const [search, setSearch] = useState("");
    function handleSubmit(e) {
        e.preventDefault();
        if (!search.trim()) return;
        onSearch(search);
    }

    return (
        <form onSubmit={handleSubmit} className="search-container">
            <img src={searchIcon} alt="search" className="search-icon"/>
            <input
                type="text"
                placeholder="Search recipe name..."
                value={search}
                className="search-bar"
                onChange={(e) => setSearch(e.target.value)}
            />
        </form>
    );
}

export default SearchBar;