import React, { Component } from "react";
import { Card, Table, ButtonGroup, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faList } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import MyToast from "./MyToast";
import { Link } from "react-router-dom";

export default class LoanList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loans: [],
      show: false,
    };
  }

  componentDidMount() {
    fetch("http://localhost:8080/loans")
      .then((response) => response.json())
      .then((data) => this.setState({ loans: data }));
  }

  deleteLoan = (loanId) => {
    axios.delete("http://localhost:8080/loan/" + loanId).then((response) => {
      if (response.status === 200) {
        this.setState({ show: true });
        setTimeout(() => this.setState({ show: false }), 3000);
        this.setState({
          loans: this.state.loans.filter((loan) => loan.id !== loanId),
        });
      } else {
        this.setState({ show: false });
      }
    });
  };

  render() {
    return (
      <div>
        <div style={{ display: this.state.show ? "block" : "none" }}>
          <MyToast
            show={this.state.show}
            message={"借阅记录删除成功。"}
            type={"danger"}
          />
        </div>
        <Card className={"border border-dark bg-dark text-white"}>
          <Card.Header>
            <FontAwesomeIcon icon={faList} /> {"  "}
            借阅列表
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th>图书</th>
                  <th>会员</th>
                  <th>借出日期</th>
                  <th>应还日期</th>
                  <th>归还日期</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {this.state.loans.length === 0 ? (
                  <tr align="center">
                    <td colSpan="6">暂无借阅记录。</td>
                  </tr>
                ) : (
                  this.state.loans.map((loan) => (
                    <tr key={loan.id}>
                      <td>{loan.book.title}</td>
                      <td>{loan.member.name}</td>
                      <td>{loan.checkoutDate}</td>
                      <td>{loan.dueDate}</td>
                      <td>{loan.returnDate ? loan.returnDate : "未归还"}</td>
                      <td>
                        <ButtonGroup>
                          <Link
                            to={"/loan/edit/" + loan.id}
                            className="btn btn-sm btn-outline-primary"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Link>{" "}
                          {"  "}
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={this.deleteLoan.bind(this, loan.id)}
                          >
                            删除 <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </ButtonGroup>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </div>
    );
  }
}
