import React from "react";
import { Button } from "@material-ui/core";
import { fromUnixTime, format } from "date-fns";
import API from "api";

const Home = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    // returns a number
    const today = Date.now();
    // console.log(format(today, "MM/dd/yyyy HH:mm"));
    // console.log(today);
    let { data } = await API.get("/create-payment-intent", {
      params: {
        date: today,
      },
    });
    console.log(today);
    console.log(data);
    let dateObj = new Date(data * 1000);
    console.log(format(today, "MM/dd/yyyy HH:mm"));
    console.log(format(dateObj, "MM/dd/yyyy HH:mm"));
  };
  return (
    <div>
      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
};

export default Home;
