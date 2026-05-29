import React, { Component } from "react";
import { Card, Form, Button, Col } from "react-bootstrap";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusSquare,
  faList,
  faEdit,
  faSave,
  faUndo,
} from "@fortawesome/free-solid-svg-icons";
import MyToast from "./MyToast";

export default class Member extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.initialState,
      show: false,
    };
    this.memberChange = this.memberChange.bind(this);
    this.submitMember = this.submitMember.bind(this);
  }

  initialState = {
    id: "",
    name: "",
    email: "",
    membershipDate: "",
    membershipType: "",
  };

  componentDidMount() {
    const memberId = +this.props.match.params.id;
    if (memberId) {
      this.findMemberById(memberId);
    }
  }

  findMemberById = (memberId) => {
    axios
      .get("http://localhost:8080/member/" + memberId)
      .then((response) => {
        if (response.data != null) {
          this.setState({
            id: response.data.id,
            name: response.data.name,
            email: response.data.email,
            membershipDate: response.data.membershipDate,
            membershipType: response.data.membershipType,
          });
        }
      })
      .catch((error) => {
        console.error("Error - " + error);
      });
  };

  resetMember = () => {
    this.setState(this.initialState);
  };

  memberChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  memberList = () => {
    return this.props.history.push("/member/list");
  };

  submitMember = (event) => {
    event.preventDefault();

    const member = {
      name: this.state.name,
      email: this.state.email,
      membershipDate: this.state.membershipDate,
      membershipType: this.state.membershipType,
    };

    axios.post("http://localhost:8080/member", member).then((response) => {
      if (response.data != null) {
        this.setState({ show: true, method: "post" });
        setTimeout(() => this.setState({ show: false }), 3000);
        this.setState(this.initialState);
      } else {
        this.setState({ show: false });
      }
    });
  };

  updateMember = (event) => {
    event.preventDefault();

    const member = {
      name: this.state.name,
      email: this.state.email,
      membershipDate: this.state.membershipDate,
      membershipType: this.state.membershipType,
    };

    axios
      .put("http://localhost:8080/member/" + this.state.id, member)
      .then((response) => {
        if (response.data != null) {
          this.setState({ show: true, method: "put" });
          setTimeout(() => this.setState({ show: false }), 3000);
          setTimeout(() => this.memberList(), 3000);
        } else {
          this.setState({ show: false });
        }
      });
  };

  render() {
    const { name, email, membershipDate, membershipType } = this.state;
    return (
      <div>
        <div style={{ display: this.state.show ? "block" : "none" }}>
          <MyToast
            show={this.state.show}
            message={
              this.state.method === "put"
                ? "会员信息更新成功。"
                : "会员信息保存成功。"
            }
            type={"success"}
          />
        </div>
        <Card className={"border border-dark bg-dark text-white"}>
          <Card.Header>
            <FontAwesomeIcon icon={this.state.id ? faEdit : faPlusSquare} />{" "}
            {this.state.id ? "编辑会员" : "添加新会员"}
          </Card.Header>
          <Form
            onReset={this.resetMember}
            onSubmit={this.state.id ? this.updateMember : this.submitMember}
            id="memberFormId"
          >
            <Card.Body>
              <Form.Row>
                <Form.Group as={Col} controlId="formGridName">
                  <Form.Label>姓名</Form.Label>
                  <Form.Control
                    required
                    autoComplete="off"
                    type="text"
                    name="name"
                    value={name}
                    onChange={this.memberChange}
                    className={"bg-dark text-white"}
                    placeholder="请输入姓名"
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="formGridEmail">
                  <Form.Label>邮箱</Form.Label>
                  <Form.Control
                    required
                    autoComplete="off"
                    type="email"
                    name="email"
                    value={email}
                    onChange={this.memberChange}
                    className={"bg-dark text-white"}
                    placeholder="请输入邮箱"
                  />
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} controlId="formGridMembershipDate">
                  <Form.Label>入会日期</Form.Label>
                  <Form.Control
                    required
                    type="date"
                    name="membershipDate"
                    value={membershipDate}
                    onChange={this.memberChange}
                    className={"bg-dark text-white"}
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="formGridMembershipType">
                  <Form.Label>会员类型</Form.Label>
                  <Form.Control
                    required
                    as="select"
                    name="membershipType"
                    value={membershipType}
                    onChange={this.memberChange}
                    className={"bg-dark text-white"}
                  >
                    <option value="">-- 请选择类型 --</option>
                    <option value="Standard">普通会员</option>
                    <option value="Premium">高级会员</option>
                    <option value="Student">学生会员</option>
                  </Form.Control>
                </Form.Group>
              </Form.Row>
            </Card.Body>
            <Card.Footer style={{ textAlign: "right" }}>
              <Button size="sm" variant="success" type="submit">
                <FontAwesomeIcon icon={faSave} />{" "}
                {this.state.id ? "更新" : "保存"}
              </Button>{" "}
              <Button size="sm" variant="info" type="reset">
                <FontAwesomeIcon icon={faUndo} /> 重置
              </Button>{" "}
              <Button
                size="sm"
                variant="info"
                type="button"
                onClick={this.memberList.bind(this)}
              >
                <FontAwesomeIcon icon={faList} /> 会员列表
              </Button>
            </Card.Footer>
          </Form>
        </Card>
      </div>
    );
  }
}
