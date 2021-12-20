import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { getMovies, IGetMoviesResult } from "../api";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  background-color: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: over;
`;

const Title = styled.h2`
  font-size: 48px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 24px;
  width: 70%;
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  height: 200px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  color: white;
  font-size: 1rem;
  cursor: pointer;

  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  opacity: 0;
  background-color: ${(props) => props.theme.black.lighter};
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: auto auto;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 15px;
  overflow: hidden;
`;

const BigCover = styled.div`
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center center;
`;
const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 10px;
  font-size: 2rem;
  position: relative;
  top: -60px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
`;

const OverLay = styled(motion.div)`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const rowVariants = {
  hidden: { x: window.innerWidth + 5 },
  visible: { x: 0 },
  exit: { x: -window.innerWidth - 5 },
};

const boxVariants = {
  normal: {
    scale: 1,
    transition: { delay: 0.5, type: "tween" },
  },
  hover: {
    zIndex: 99,
    scale: 1.3,
    y: -50,
    transition: { delay: 0.5, type: "tween", duration: 0.3 },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: { delay: 0.5, type: "tween", duration: 0.3 },
  },
};
const OFF_SET = 6;

function Home() {
  const { scrollY, scrollYProgress } = useViewportScroll();
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movie/:movieId");

  const { isLoading, data } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );

  const [page, setPage] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const increaseIdx = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIdx = Math.ceil(totalMovies / OFF_SET) - 1;

      console.log("totalMovies", totalMovies);
      console.log("maxIdx", maxIdx);
      setPage((curr) => (curr >= maxIdx ? 0 : curr + 1));
    }
  };

  const toggleLeaving = () => {
    setLeaving((curr) => !curr);
  };

  const onBoxClicked = (movieId: number) => {
    history.push(`/movie/${movieId}`);
  };

  const onOverlayClick = () => {
    history.push("/");
  };

  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find(
      (movie) => movie.id + "" === bigMovieMatch.params.movieId
    );

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            onClick={increaseIdx}
            bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                key={page}
                variants={rowVariants}
                transition={{ type: "tween", duration: 2 }}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {data?.results
                  .slice(1)
                  .slice(OFF_SET * page, OFF_SET * page + OFF_SET)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + ""}
                      onClick={() => onBoxClicked(movie.id)}
                      variants={boxVariants}
                      key={movie.id}
                      initial="normal"
                      whileHover="hover"
                      bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <OverLay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <BigMovie
                  layoutId={bigMovieMatch.params.movieId}
                  style={{ top: scrollY.get() + 80 }}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )}
                          )`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
