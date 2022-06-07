import React from "react";

import AuthProvider from "../store/AuthProvider";
import CurrentExamProvider from "../store/current-exam-context/CurrentExamProvider";
import Layout from "../components/Layout/Layout";
import "../styles/styles.css";

const MyApp = (props) => {
  const { Component, pageProps } = props;

  return (
    <AuthProvider>
      <CurrentExamProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </CurrentExamProvider>
    </AuthProvider>
  );
};

export default MyApp;
