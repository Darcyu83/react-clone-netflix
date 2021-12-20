import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
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

const Box = styled(motion.div)`
  background-color: white;
  height: 200px;

  color: red;
  font-size: 64px;
`;

const rowVariants = {
  hidden: { x: window.innerWidth + 5 },
  visible: { x: 0 },
  exit: { x: -window.innerWidth - 5 },
};

const icon = {
  hidden: {
    opacity: 0,
    pathLength: 0,
    fill: "rgba(255, 255, 255, 0)",
  },
  visible: {
    opacity: 1,
    pathLength: 1,
    fill: "rgba(255, 255, 255, 1)",
  },
};

function Home() {
  const { isLoading, data } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );

  const [idx, setIdx] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const increaseIdx = () => {
    if (leaving) return;
    setLeaving(true);
    setIdx((curr) => curr + 1);
  };

  const toggleLeaving = () => {
    setLeaving((curr) => !curr);
  };
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
                key={idx}
                transition={{ type: "tween", duration: 2 }}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {["1", "2", "3", "4", "5", "6"].map((i) => (
                  <Box key={i}>{i}</Box>
                ))}
              </Row>
            </AnimatePresence>
          </Slider>
        </>
      )}

      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        className="item"
        style={{
          width: "95px",
          height: "25px",
        }}
      >
        <motion.path
          d="M0 100V0l50 50 50-50v100L75 75l-25 25-25-25z"
          variants={icon}
          initial="hidden"
          animate="visible"
          style={{
            stroke: "yellow",
            strokeWidth: 1,
          }}
          transition={{
            default: { duration: 2, ease: "easeInOut" },
            fill: { duration: 2, ease: [1, 0, 0.8, 1] },
          }}
        />
      </motion.svg>
    </Wrapper>
  );
}

export default Home;
