import React, { Component } from "react";
import { Container, Row, Jumbotron, Col } from "react-bootstrap";

export default class Welcome extends Component {
  render() {
    return (
      <Jumbotron className="bg-dark text-white">
        <h1>欢迎使用图书馆管理系统</h1>
        <blockquote className="blockquote mb-O">
          <p>"阅读能带你去你从未到过的地方。"</p>
          <footer className="blockquote-footer"> 苏斯博士</footer>
        </blockquote>
      </Jumbotron>
    );
  }
}
