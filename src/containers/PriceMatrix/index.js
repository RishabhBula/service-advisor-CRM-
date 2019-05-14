import React, { Component } from "react";
import { Card, CardBody, Button, UncontrolledTooltip } from "reactstrap";
import PriceMatrixComponent from "../../components/PriceMatrix/AddEdit";
import PriMatrixList from "../../components/PriceMatrix/PriMatrixList";
import { logger } from "../../helpers/Logger";
import { InsertAtParticularIndex } from "../../helpers/Array";
import { getMatrixList, addMatrixRequest, updateMatrixRequest, deleteMatrixRequest } from "../../actions"
import { connect } from 'react-redux';
import Validator from "js-object-validation";
import {
  CreatePriceMatrixValidations,
  CreatePriceMatrixValidMessaages
} from "../../validations";
import { ConfirmBox } from "../../helpers/SweetAlert";
import * as qs from 'query-string';
import { isEqual } from '../../helpers/Object';
import { toast } from "react-toastify";
import {
  CaluculateMarkupByMargin,
  CaluculateMarginByMarkup
} from "../../helpers/Sales";

class PriceMatrix extends Component {
  constructor(props) {
    super(props);
    this.state = {
      matrixRange: [
        {
          margin: "50",
          markup: "100",
          lower: "0.00",
          upper: "beyond"
        }
      ],
      matrixName: "",
      errors: {},
      matrixId: "",
      addNewMatrix: false,
      activeMatrix: "",
      updatedAt: "",
    };
  }
  componentDidMount = () => {
    const query = qs.parse(this.props.location.search);
    this.props.getMatrixList({ ...query, page: query.page || 1 })
  }
  componentDidUpdate = ({ matrixListReducer, location }) => {
    if (matrixListReducer.matrixData !== this.props.matrixListReducer.matrixData) {
      this.props.getMatrixList()
      this.resetAll(false)
    }
    const prevQuery = qs.parse(location.search);
    const currQuery = qs.parse(this.props.location.search);
    if (!isEqual(prevQuery, currQuery)) {
      const data = {
        ...currQuery,
        page: currQuery.page || 1,
      };
      this.props.getMatrixList(data);
    }
  }
  resetAll = (isNewMatrix) => {
    if (isNewMatrix) {
      this.setState({
        matrixRange: [
          {
            margin: "50",
            markup: "100",
            lower: "0.00",
            upper: "beyond"
          }
        ],
        matrixName: "",
        errors: {},
        matrixId: "",
        isEditMatrix: false,
        addNewMatrix: true
      })
    } else {
      this.setState({
        matrixRange: [
          {
            margin: "50",
            markup: "100",
            lower: "0.00",
            upper: "beyond"
          }
        ],
        matrixName: "",
        errors: {},
        matrixId: "",
        isEditMatrix: false,
        addNewMatrix: false
      })
    }
  }
  handleMatrixModal = () => {
    const { modelInfoReducer, modelOperate } = this.props
    const { modelDetails } = modelInfoReducer;
    const { matrixAddModalOpen } = modelDetails;
    this.setState({
      matrixRange: [
        {
          margin: "50",
          markup: "100",
          lower: "0.00",
          upper: "beyond"
        }
      ],
      matrixName: "",
      errors: {},
      matrixId: "",
      isEditMatrix: false,
      addNewMatrix: true
    }, () => {
      modelOperate({
        matrixAddModalOpen: !matrixAddModalOpen
      })
    })
  }

  handleChange = (index, e) => {
    const { name, value } = e.target
    if (name === 'matrixName') {
      this.setState({
        [name]: value
      });
    } else {
      console.log("!!!!!!!!!!!!!!!!!", value, parseFloat(value) > 100);
      if ((name === "margin") && parseFloat(value) > 100) {
        return
      }
      const matrixRange = [...this.state.matrixRange]
      if (name === "margin") {
        if (!value) {
          matrixRange[index].markup = CaluculateMarkupByMargin(parseFloat(0.99)).toFixed(2);
          matrixRange[index].margin = 0.99
        }
        else if (parseFloat(value) < 0.99 || isNaN(this.state.matrixRange[index].markup)) {
          if (!toast.isActive(this.toastId)) {
            this.toastId = toast.error("Margin value should not be less than 0.99.");
          }
          return
        }
        else {
          matrixRange[index].markup = CaluculateMarkupByMargin(parseFloat(value)).toFixed(2);
          matrixRange[index].margin = value
        }
      } if (name === "markup") {
        if (!value) {
          matrixRange[index].margin = CaluculateMarginByMarkup(parseFloat(1)).toFixed(2);
          matrixRange[index].markup = 1
        }
        else if (parseFloat(value) < 1 || isNaN(this.state.matrixRange[index].margin) || !value) {
          if (!toast.isActive(this.toastId)) {
            this.toastId = toast.error("Markup value should not be less than 1.");
          }
          return
        }
        else {
          matrixRange[index].margin = CaluculateMarginByMarkup(parseInt(value)).toFixed(2);
          matrixRange[index].markup = value
        }
      }
      this.setState({
        matrixRange
      })
    }
  }
  handleAddMatrixRange = () => {
    const { matrixRange } = this.state;
    const upper = "beyond";
    const lower = parseFloat(matrixRange[matrixRange.length - 1].lower) + 100;
    matrixRange[matrixRange.length - 1].upper =
      parseFloat(matrixRange[matrixRange.length - 1].lower) + 99.99;
    matrixRange.push({
      margin: "50",
      markup: "100",
      lower,
      upper
    });
    this.setState({
      matrixRange
    });
  };
  handleCostChange = (index, e) => {
    const { name, value } = e.target;
    if (name === "costPrice1") {
      const matrixRange = [...this.state.matrixRange];
      if (parseFloat(value) >= parseFloat(matrixRange[index].upper)) {
        if (!toast.isActive(this.toastId)) {
          this.toastId = toast.error("Lower price range cannot be higher or equal to upper price.");
        }
        return
      } else if (isNaN(parseFloat(value)) || parseFloat(value) < 1) {
        if (!toast.isActive(this.toastId)) {
          this.toastId = toast.error("Minimum price should not be less than 1");
        }
        matrixRange[index].lower = 1;
        matrixRange[index - 1].upper = parseFloat(1) - 0.01;
        this.setState({
          matrixRange
        });
      } else if (parseFloat(value) <= parseFloat(matrixRange[index - 1].lower)) {
        if (!toast.isActive(this.toastId)) {
          this.toastId = toast.error("Lower price range cannot be lower or equal to previous lower price.");
        }
        return
      }
      else {
        matrixRange[index].lower = value;
        matrixRange[index - 1].upper = parseFloat(value) - 0.01;
        this.setState({
          matrixRange
        });
      }
    } else {
      const matrixRange = [...this.state.matrixRange];
      if (parseFloat(value) <= parseFloat(matrixRange[index].lower)) {
        if (!toast.isActive(this.toastId)) {
          this.toastId = toast.error("Upper price range cannot be lower or equal to lower price.");
        }
        return
      }
      else if (isNaN(parseFloat(value)) || parseFloat(value) < 1) {
        if (!toast.isActive(this.toastId)) {
          this.toastId = toast.error("Minimum price should not be less than 0.99");
        }
        matrixRange[index].upper = 0.99;
        matrixRange[index + 1].lower = parseFloat(0.99) + 0.01;
        this.setState({
          matrixRange
        });
      }
      else if (parseFloat(value) >= parseFloat(matrixRange[index + 1].upper)) {
        if (!toast.isActive(this.toastId)) {
          this.toastId = toast.error("Upper price range cannot be higher than or equal to next upper price.");
        }
        return
      } else {
        matrixRange[index].upper = value;
        matrixRange[index + 1].lower = parseFloat(value) + 0.01;
        this.setState({
          matrixRange
        });
      }
    }
  };
  handleRemoveMatrixRange = index => {
    logger(index);
    const { matrixRange } = this.state;
    const lastIndex = matrixRange.length - 1;
    if (index === lastIndex) {
      matrixRange[index - 1].upper = "beyond";
    } else {
      matrixRange[index + 1].lower =
        parseFloat(matrixRange[index - 1].upper) + 0.01;
    }
    matrixRange.splice(index, 1);
    this.setState({
      matrixRange
    });
  };
  handleAddBelowMatrixRange = (index, name) => {
    let { matrixRange } = this.state;
    const lastIndex = matrixRange.length - 1;
    if (index === lastIndex && name === "below") {
      const upper = "beyond";
      const lower = parseFloat(matrixRange[lastIndex].lower) + 100;
      matrixRange[lastIndex].upper =
        parseFloat(matrixRange[lastIndex].lower) + 99.99;
      matrixRange.push({
        margin: "50",
        markup: "100",
        lower,
        upper
      });
      this.setState({
        matrixRange
      });
    } else if (name === "below") {
      const newMatrixRange = InsertAtParticularIndex(
        Object.assign([], matrixRange),
        index + 1,
        {
          margin: "",
          markup: "",
          upper: parseFloat(matrixRange[index].upper) + 100,
          lower: parseFloat(matrixRange[index].upper) + 0.01
        }
      );
      const nMatrixRange = [];
      for (let ind = 0; ind < newMatrixRange.length; ind++) {
        const mat = newMatrixRange[ind];
        if (ind <= index + 1) {
          nMatrixRange.push(mat);
        } else if (ind === newMatrixRange.length - 1) {
          nMatrixRange.push({
            ...mat,
            upper: "beyond",
            lower: newMatrixRange[ind].lower + 100
          });
        } else {
          nMatrixRange.push({
            ...mat,
            upper: newMatrixRange[ind].upper + 100,
            lower: newMatrixRange[ind].lower + 100
          });
        }
      }
      nMatrixRange.sort((a, b) => parseFloat(a.lower) - parseFloat(b.lower));
      this.setState({
        matrixRange: nMatrixRange
      });
    } else if (name === "above") {
      const newMatrixRange = InsertAtParticularIndex(
        Object.assign([], matrixRange),
        index - 1,
        {
          margin: "",
          markup: "",
          upper:
            index === lastIndex
              ? matrixRange[index].lower - 0.01
              : parseFloat(matrixRange[index].upper) - 100,
          lower: parseFloat(matrixRange[index].lower) - 100
        }
      );
      const nMatrixRange = [];
      for (let ind = 0; ind < newMatrixRange.length; ind++) {
        const mat = newMatrixRange[ind];
        if (ind < index) {
          nMatrixRange.push(mat);
        } else if (ind === newMatrixRange.length - 1) {
          nMatrixRange.push({
            ...mat,
            upper: "beyond",
            lower: newMatrixRange[ind].lower + 100
          });
        } else {
          nMatrixRange.push({
            ...mat,
            upper: newMatrixRange[ind].upper + 100,
            lower: newMatrixRange[ind].lower + 100
          });
        }
        logger(mat);
      }
      nMatrixRange.sort((a, b) => parseFloat(a.lower) - parseFloat(b.lower));
      this.setState({
        matrixRange: nMatrixRange
      });
    }
  };

  onSearch = data => {
    const { location } = this.props;
    const { pathname } = location;
    this.props.redirectTo([pathname, qs.stringify(data)].join('?'));
  };

  handleMatrixDelete = async (matrixId) => {
    const { value } = await ConfirmBox({
      text: "Do you want to delete this price matrix?"
    });
    if (!value) {
      return;
    }
    const data = {
      matrixId: matrixId
    }
    this.props.deletePriceMatrix(data)
  }

  handleUpdateMatrix = (matrixData) => {
    const {
      matrixName,
      matrixRange,
      updatedAt
    } = matrixData
    this.setState({
      matrixName,
      matrixRange,
      updatedAt,
      matrixId: matrixData._id,
      isEditMatrix: true,
    })
    const { modelDetails } = this.props.modelInfoReducer;
    let modaldata = {
      matrixAddModalOpen: !modelDetails.matrixAddModalOpen,
    };
    this.props.modelOperate(modaldata);
  }
  handleAddMatrix = () => {
    const { isEditMatrix } = this.state
    const paylod = { matrixRange: this.state.matrixRange, matrixName: this.state.matrixName }
    const { isValid, errors } = Validator(
      paylod,
      CreatePriceMatrixValidations,
      CreatePriceMatrixValidMessaages
    );
    if (!isValid) {
      this.setState({
        errors,
        isLoading: false
      });
      return;
    } else {
      if (isEditMatrix) {
        const paylod = { matrixRange: this.state.matrixRange, matrixName: this.state.matrixName, id: this.state.matrixId }
        this.props.updatePriceMatrix(paylod)
      } else {
        this.props.addPriceMatrix(paylod)
      }
    }
  }
  render() {
    const { matrixListReducer, modelInfoReducer } = this.props;
    const { modelDetails } = modelInfoReducer;
    const { matrixAddModalOpen } = modelDetails;
    const { matrixRange, errors, matrixName, isEditMatrix, addNewMatrix, updatedAt } = this.state;
    return (
      <>
        <Card className={"white-card"}>

          <CardBody className={"custom-card-body position-relative"}>
            <div className={"text-right invt-add-btn-block"}>
              <Button
                color='primary'
                id='add-user'
                onClick={this.handleMatrixModal}
              >
                <i className={'fa fa-plus'} />
                &nbsp; Add New Matrix
                </Button>
              <UncontrolledTooltip target={'add-user'}>
                Add New price matrix
              </UncontrolledTooltip>
            </div>
            <PriMatrixList
              matrixList={matrixListReducer.matrixList}
              isLoading={matrixListReducer.isLoading}
              handleUpdateMatrix={this.handleUpdateMatrix}
              addNewMatrix={() => this.resetAll(true)}
              handleMatrixDelete={this.handleMatrixDelete}
              onSearch={this.onSearch}
              onClick={this.handleMatrixModal}
            />
          </CardBody>
        </Card>
        <PriceMatrixComponent
          matrixRange={matrixRange}
          handleAddBelowMatrixRange={this.handleAddBelowMatrixRange}
          handleCostChange={this.handleCostChange}
          handleRemoveMatrixRange={this.handleRemoveMatrixRange}
          handleAddMatrixRange={this.handleAddMatrixRange}
          handleAddMatrix={this.handleAddMatrix}
          handleChange={this.handleChange}
          errors={errors}
          matrixName={matrixName}
          isEditMatrix={isEditMatrix}
          matrixModalOpen={matrixAddModalOpen}
          handleMatrixModal={this.handleMatrixModal}
          addNewMatrix={addNewMatrix}
          updateDate={updatedAt}
        />
      </>
    );
  }
}
const mapStateToProps = state => ({
  matrixListReducer: state.matrixListReducer,
  modelInfoReducer: state.modelInfoReducer,
});

const mapDispatchToProps = dispatch => ({
  getMatrixList: (data) => {
    dispatch(getMatrixList(data));
  },
  addPriceMatrix: (data) => {
    dispatch(addMatrixRequest(data))
  },
  updatePriceMatrix: (data) => {
    dispatch(updateMatrixRequest(data))
  },
  deletePriceMatrix: (data) => {
    dispatch(deleteMatrixRequest(data))
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PriceMatrix);
