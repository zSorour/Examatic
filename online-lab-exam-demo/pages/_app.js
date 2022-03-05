import React from "react";

import Layout from "../components/Layout/Layout";
import "../styles/styles.css";

const MyApp = (props) => {
  const { Component, pageProps } = props;

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

export default MyApp;
