import React from "react";

import AuthProvider from "../store/AuthProvider";
import Layout from "../components/Layout/Layout";
import "../styles/styles.css";

const MyApp = (props) => {
  const { Component, pageProps } = props;

  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
};

export default MyApp;
