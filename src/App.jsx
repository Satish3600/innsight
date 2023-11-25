import React, { useState, useEffect } from "react";
import axios from "axios";
import starwarImage from "./assets/starwarimg.jpg";
import "./App.css";



function App() {
  const [cards, setCards] = useState([]);
  const [filmNames, setFilmNames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCard, setCurrentCard] = useState([]);
  const [pages, setPages] = useState(1);
  const [count, setCount] = useState(3);
  const [totalReacords, setTotalRecords] = useState(1);

  useEffect(() => {
    fetchFilms();
  }, []);

  const fetchFilms = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("https://swapi.dev/api/films");
      const films = response.data.results?.map((x) => {
        return { title: x.title, episode_id: x.episode_id, url: x.url };
      });
      setFilmNames(films);
      films.length > 0 && fetchInitialData(films, 1);
    } catch (error) {
    } finally {
    }
  };

  const fetchInitialData = async (films,page) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://swapi.dev/api/people/?page=${page}`
      );
      setIsLoading(false);
      setTotalRecords(
        count > totalReacords
          ? totalReacords + response.data.results.length
          : response.data.results.length
      );
      const initialCharacters = response.data.results.map((x) => {
        const filmNames = [];
        if (x.films.length > 0) {
          x.films.map((y) => {
            const filmname = films.filter((film) => film.url == y);
            if (filmname.length > 0) {
              filmNames.push(filmname[0].title);
            }
          });
        }
        return { ...x, filmNames };
      });
      setCards(
        count == 3
          ? [...initialCharacters.slice(0, 3)]
          : [...cards, ...initialCharacters[0]]
      );
      setCurrentCard(
        count == 3
          ? [...initialCharacters.slice(3)]
          : [...initialCharacters.slice(1)]
      );
    } catch (error) {
    } finally {
    }
  };

  const addCard = () => {
    setCount((preVal) => preVal + 1);
    if (count > totalReacords) {
      // alert("if")
      setPages(pages + 1);
      fetchInitialData(filmNames,pages + 1);
    } else {
      // console.log("else")
      console.log("count" , count)
      console.log("totalReacords" , totalReacords)
      setCards([...cards, currentCard[0]]);
      setCurrentCard(currentCard.splice(1));
    }
  };

  const removeCard = (index) => {
    const updatedCards = [...cards];
    updatedCards.splice(index, 1);
    setCards(updatedCards);
  };

  return (
    <>
      <div className="wrapper">
        <div className="header">StarWar Cards</div>
        <div className="main_button">
          <button className="btn" onClick={addCard} disabled={isLoading}>
            {isLoading ? "Loading..." : "Add Card"}
          </button>
        </div>
        <div className="cards_wrap">
          {cards?.map((character, index) => (
            <div key={index} className="card_item">
              <div className="card_inner">
                {cards?.length > 3 && (
                  <div className="cls-btn-main">
                    <button
                      className="close-button"
                      onClick={() => removeCard(index)}
                    >
                      X
                    </button>
                  </div>
                )}
                <div className="first_card">
                  <img src={starwarImage} alt="Disney" />

                  <div>
                    <p className="role_name">Name: {character?.name}</p>
                    <p className="real_name">Height: {character?.height}</p>
                  </div>
                </div>
                <div className="film">
                  Films: {character?.filmNames?.toString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
