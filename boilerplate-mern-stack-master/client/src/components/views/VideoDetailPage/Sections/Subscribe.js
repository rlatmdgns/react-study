import React, { useState, useEffect } from "react";
import Axios from "axios";

function Subscribe(props) {
  const [SubscribeNumber, setSubscribeNumber] = useState(0);
  const [Subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    let variable = { userTo: props.userTo };

    Axios.post("/api/subscribe/subcribeNumber", variable).then((response) => {
      if (response.data.success) {
        setSubscribeNumber(response.data.subscribeNumber);
      } else {
        alert("구독자 수정보를 받아오지 못했습니다.");
      }
    });

    let subscribedVariable = {
      userTo: props.userTo,
      userFrom: localStorage.getItem("userId"),
    };

    Axios.post("/api/subscribe/subscribed", subscribedVariable).then(
      (response) => {
        if (response.data.success) {
          setSubscribed(response.data.subscribed);
        } else {
          alert("정보를 받아오지 못했습니다.");
        }
      }
    );
  }, []);

  const onSubcribe = () => {
    let subscribedVariable = {
      userTo: props.userTo,
      userFrom: props.userFrom,
    };
    if (Subscribed) {
      Axios.post("/api/subscribe/unSubscribe", subscribedVariable).then(
        (response) => {
          if (response.data.success) {
            setSubscribeNumber(SubscribeNumber - 1);
            setSubscribed(!Subscribed);
          } else {
            alert("구독 취소 하는데 실패했습니다.");
          }
        }
      );
      // 이미 구독중
    } else {
      Axios.post("/api/subscribe/subscribed", subscribedVariable).then(
        (response) => {
          if (response.data.success) {
            setSubscribeNumber(SubscribeNumber + 1);
            setSubscribed(!Subscribed);
          } else {
            alert("구독 하는데 실패했습니다.");
          }
        }
      );
    }
  };
  return (
    <div>
      <button
        style={{
          backgroundColor: `${Subscribed ? "#cc0000" : "#aaa"}`,
          border: "0",
          borderRadius: "4px",
          color: "#fff",
          padding: "10px 16px",
          fontWeight: "500",
          fontSize: "1rem",
          textTransform: "uppercase",
        }}
        onClick={onSubcribe}
      >
        {SubscribeNumber}
        {Subscribed ? "Subcribed" : "Subcribe"}
      </button>
    </div>
  );
}

export default Subscribe;
