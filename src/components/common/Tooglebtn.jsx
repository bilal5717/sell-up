import React from 'react';
import styled from 'styled-components';

const Switch = ({ value, onChange }) => {
  return (
    <StyledWrapper>
      <div className="toggle-button-cover">
        <div id="button-3" className="button r">
          <input
            className="checkbox"
            type="checkbox"
            checked={value}
            onChange={(e) => onChange(e.target.checked)}
          />
          <div className="knobs" />
          <div className="layer" />
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .toggle-button-cover {
    display: table-cell;
    float: right;
    box-sizing: border-box;
  }

  .button-cover {
    height: 100px;
    margin: 20px;
    background-color: #fff;
    box-shadow: 0 10px 20px -8px #c5d6d6;
    border-radius: 4px;
    top: 22px;
    position: relative;
  }

  .button-cover,
  .knobs,
  .layer {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .button {
    position: relative;
    top: 50%;
    width: 60px;
    height: 26px;
    margin: -20px auto 0 auto;
    overflow: hidden;
  }

  .checkbox {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    opacity: 0;
    cursor: pointer;
    z-index: 3;
  }

  .knobs {
    z-index: 2;
  }

  .layer {
    width: 100%;
    background-color: #ebf7fc;
    transition: 0.3s ease all;
    z-index: 1;
  }

  .button.r,
  .button.r .layer {
    border-radius: 100px;
  }

  #button-3 .knobs:before {
    content: "YES";
    position: absolute;
    top: 0px;
    left: 4px;
    width: 25px;
    height: 25px;
    color: #fff;
    font-size: 10px;
    font-weight: bold;
    text-align: center;
    line-height: 1;
    padding: 9px 4px;
    background-color: #03a9f4;
    border-radius: 50%;
    transition: 0.3s ease all, left 0.3s cubic-bezier(0.18, 0.89, 0.35, 1.15);
  }

  #button-3 .checkbox:active + .knobs:before {
    width: 46px;
    border-radius: 100px;
  }

  #button-3 .checkbox:checked:active + .knobs:before {
    margin-left: -26px;
  }

  #button-3 .checkbox:checked + .knobs:before {
    content: "NO";
    left: 33px;
    background-color: #f44336;
  }

  #button-3 .checkbox:checked ~ .layer {
    background-color: #fcebeb;
  }
`;

export default Switch;
