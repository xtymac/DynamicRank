import React from 'react';
import styled from 'styled-components';
import data from './data';
import Countup from './countup';

const Wrapper = styled.div`
  position: relative;
  width: 320px;
  height: 100%;
  margin: 0 auto;
  .number {
    width: 24px;
    text-align: center;
  }
  .score {
    -webkit-box-flex: 1;
    flex-grow: 1;
    text-align: right;
    ::after {
      display: inline-block;
      content: 'pt';
    }
  }
`;

const Item = styled.div`
  width: 100%;
  height: 48px;
  position: absolute;
  left: 50%;
  top: ${(props) => props.top};
  transform: translate(-50%, 0);
  transition: all 0.3s ease 0s;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
`;

const Img = styled.div`
  background-image: url(${(props) => props.img}),
    url(https://webcdn.17app.co/17live/ig-default.svg);
  background-size: 100%;
  width: 36px;
  height: 36px;
  border-radius: 18px;
  border: 2px solid #fff;
`;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: data.map((v) => {
        v.eScore = v.score;
        return v;
      }),
      sortObj: this.getObj(data),
    };
  }

  componentDidMount() {
    this.T = setInterval(() => {
      this.changeData();
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.T);
  }

  getObj(data) {
    const obj = {};
    data.forEach((v, i) => {
      obj[v.userID] = i;
    });
    return obj;
  }

  changeData = () => {
    const { data, sortObj } = this.state;
    const a = parseInt(Math.random() * 10);
    const b = parseInt(Math.random() * 10);
    const aAdd = parseInt(Math.random() * 2000);
    const bAdd = parseInt(Math.random() * 2000);
    data.forEach((v) => (v.score = v.eScore || v.score));
    data[a].eScore = data[a].score + aAdd;
    data[b].eScore = data[b].score + bAdd;
    const arr = Object.assign([], data);
    arr.sort((a, b) => b.score - a.score);
    arr.forEach((v, i) => (sortObj[v.userID] = i));
    this.setState({ data, sortObj }, () => {
      data.forEach((v) => {
        if (v.score !== v.eScore) {
          this[`C${v.userID}`] = new Countup(this[v.userID], v.score, v.eScore);
          this[`C${v.userID}`] && this[`C${v.userID}`].start();
        }
      });
    });
  };

  render() {
    const { data, sortObj } = this.state;
    return (
      <Wrapper>
        {data.map((v) => (
          <Item key={v.userID} top={`${48 * sortObj[v.userID]}px`}>
            <div className="number">{sortObj[v.userID] + 1}</div>
            <Img img={v.picture} />
            <div>{v.displayName}</div>
            <div
              className="score"
              ref={(score) => {
                this[v.userID] = score;
              }}
            >
              {v.eScore}
            </div>
          </Item>
        ))}
      </Wrapper>
    );
  }
}
