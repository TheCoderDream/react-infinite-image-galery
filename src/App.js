import React, { useEffect, useState } from "react";
import "./style.css";

const ACCESS_KEY = '2J5p-V98wBnLNnbi0P5U_noLosW515GU8qoS7pvQd-Q';

function debounceTime(timeInMilisecond, cb) {
  let timeOutId;

  return () => {
    timeOutId && clearTimeout(timeOutId);
    timeOutId = setTimeout(() => {
      cb();
    }, timeInMilisecond);
  }
}

export default function App() {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPhotos();
  }, [page]);

  useEffect(() => {
    searchPhotos()
  }, [query]);

  useEffect(() => {
    window.addEventListener('scroll', onScroll)

    function onScroll() {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
           setPage((p) => p + 1);
      }
    }

    return () => {
      window.removeEventListener(onScroll);
    }
  }, []);

  function getPhotos() {
    let apiUrl = 'https://api.unsplash.com/photos?';
    if (query?.trim()) apiUrl = `https://api.unsplash.com/search/photos?query=${query}`;
    apiUrl += `&page=${page}`;
    apiUrl += `&client_id=${ACCESS_KEY}`;
    setLoading(true);

    console.log(query, apiUrl, loading);

    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        const imagesFromApi = data.results ?? data;

        if(page === 1) {
          return setImages(imagesFromApi);
        }

        return setImages(images => [...images, ...imagesFromApi]);
      })
  }

  function _searchPhotos() {
    if (query?.trim()) setPage(1);
    getPhotos();
  }

  const searchPhotos = debounceTime(500, _searchPhotos);


  return (
    <div className="app">
      <h1>Unsplash Image Gallery!</h1>
      <form onSubmit={() => {e.preventDefault(); searchPhotos()}}>
        <input
          type="text"
          placeholder="Search Unsplash"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>

      <div className="image-grid">
        {
          images.map((image, index) => (
            <a
              className="image"
              key={image.id} 
              href={image.links.html}
              target="_blank"
              rel="nooper noreferrer"
              >
                <img 
                  src={image.urls.regular} 
                  alt={image.alt_description}
                />
              </a>
          ))
        }
        {
          loading && <h4>Loading...</h4>
        }
      </div>
    </div>
  );
}
