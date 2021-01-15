
/*eslint-disable*/
import React from "react";
import { Container, Row } from "reactstrap";
// used for making the prop types of this component
import PropTypes from "prop-types";

class Footer extends React.Component {
  render() {
    return (
      <footer
        className={"footer" + (this.props.default ? " footer-default" : "")}
      >
        <Container fluid={this.props.fluid ? true : false}>
          <Row>
            <nav className="footer-nav">
              <ul>
                <li>
                  <a>
                    FittZee &copy; {1900 + new Date().getYear()} 
                  </a>
                </li>
              </ul>
            </nav>
            <div className="credits ml-auto">
              <div className="copyright">
                Made with{" "}
                <i className="fa fa-heart heart text-danger" /> for FittZee 2.0.0
              </div>
            </div>
          </Row>
        </Container>
      </footer>
    );
  }
}

Footer.propTypes = {
  default: PropTypes.bool,
  fluid: PropTypes.bool,
};

export default Footer;
