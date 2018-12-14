import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Button, ButtonToolbar,
  Card, CardBody, CardFooter, CardTitle,
  Col, Row,
  Modal, ModalBody, ModalFooter, ModalHeader,
  Input, Label, FormGroup
} from 'reactstrap';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { getStyle } from '@coreui/coreui/dist/js/coreui-utilities'
import axios from 'axios'

var moment = require('moment');
const brandSuccess = getStyle('--success')
const brandInfo = getStyle('--info')

const monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const yearName = [2016, 2017, 2018]

// Card Chart 1
const cardChartData1 = {
  labels: [],
  datasets: [
    {
      label: 'Car come in',
      backgroundColor: brandInfo,
      borderColor: 'rgba(255,255,255,.55)',
      data: [],
    },
  ],
};

const cardChartOpts1 = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips
  },
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
  scales: {
    xAxes: [
      {
        gridLines: {
          color: 'transparent',
          zeroLineColor: 'transparent',
        },
        ticks: {
          fontSize: 2,
          fontColor: 'transparent',
        },

      }],
    yAxes: [
      {
        display: false,
        ticks: {
          display: false,
          min: Math.min.apply(Math, cardChartData1.datasets[0].data) - 5,
          max: Math.max.apply(Math, cardChartData1.datasets[0].data) + 5,
        },
      }],
  },
  elements: {
    line: {
      tension: 0.00001,
      borderWidth: 1,
    },
    point: {
      radius: 2,
      hitRadius: 10,
      hoverRadius: 4,
    },
  },
};

const cardChartData2 = {
  labels: [],
  datasets: [
    {
      label: 'Car go out',
      backgroundColor: brandSuccess,
      borderColor: 'rgba(255,255,255,.55)',
      data: [],
    },
  ],
};

const cardChartOpts2 = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips
  },
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
  scales: {
    xAxes: [
      {
        gridLines: {
          color: 'transparent',
          zeroLineColor: 'transparent',
        },
        ticks: {
          fontSize: 2,
          fontColor: 'transparent',
        },

      }],
    yAxes: [
      {
        display: false,
        ticks: {
          display: false,
          min: Math.min.apply(Math, cardChartData2.datasets[0].data) - 5,
          max: Math.max.apply(Math, cardChartData2.datasets[0].data) + 5,
        },
      }],
  },
  elements: {
    line: {
      tension: 0.00001,
      borderWidth: 1,
    },
    point: {
      radius: 2,
      hitRadius: 10,
      hoverRadius: 4,
    },
  },
};

const mainChart = {
  labels: [],
  datasets: [
    {
      label: 'Cars come in',
      backgroundColor: 'transparent',
      borderColor: brandInfo,
      pointHoverBackgroundColor: '#fff',
      borderWidth: 2,
      data: [],
    },
    {
      label: 'Cars go out',
      backgroundColor: 'transparent',
      borderColor: brandSuccess,
      pointHoverBackgroundColor: '#fff',
      borderWidth: 2,
      data: [],
    },
  ],
};

const mainChartOpts = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips,
    intersect: true,
    mode: 'index',
    position: 'nearest',
    callbacks: {
      labelColor: function (tooltipItem, chart) {
        return { backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor }
      }
    }
  },
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
  scales: {
    xAxes: [
      {
        gridLines: {
          drawOnChartArea: false,
        },
      }],
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
          maxTicksLimit: 5,
          stepSize: Math.ceil(250 / 5),
          max: 250,
        },
      }],
  },
  elements: {
    line: {
      tension: 0.00001,
      borderWidth: 1,
    },
    point: {
      radius: 2,
      hitRadius: 10,
      hoverRadius: 4,
      hoverBorderWidth: 3,
    },
  },
};

class Statistics extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chooseModalClick: false,
      chooseByYear: false,
      monthSelect: moment().format("MM"),
      yearSelect: moment().format("YYYY"),
      mainChartState: mainChart,
      mainChartOptsState: mainChartOpts,
      cardChartData1State: cardChartData1,
      cardChartOpts1State: cardChartOpts1,
      cardChartData2State: cardChartData2,
      cardChartOpts2State: cardChartOpts2,
      inSum: 0,
      outSum: 0
    };
  }

  getHistoryByMonth = (data) => axios.get("/getHistoryByMonth", data)
    .then((res) => res.data)
  getHistoryByYear = (data) => axios.get("/getHistoryByYear", data)
    .then((res) => res.data)

  onBtnClick = () => {
    this.setState({
      chooseModalClick: true
    })
  }

  onRemoveModal = () => {
    this.setState({
      chooseModalClick: false,
    })
  }

  onChangeValue = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  onSearchData = () => {
    if (!this.state.chooseByYear) {
      this.getHistoryByMonth({ params: { month: this.state.monthSelect, year: this.state.yearSelect } }).then(res => {
        this.updateChartMonth(res, moment(this.state.yearSelectSelect + "-" + this.state.monthSelect, "YYYY-MM").daysInMonth())
      })
    } else {
      this.getHistoryByYear({ params: { year: this.state.yearSelect } }).then(res => {
        this.updateChartYear(res)
      })

    }
    this.setState({
      chooseModalClick: false,
    })
  }

  onChangeModal = () => {
    this.setState({
      chooseByYear: !this.state.chooseByYear
    })
  }

  updateChartMonth = (data, numberOfDay) => {
    var dataMainChart = []
    var dataInChart = []
    var dataOutChart = []
    var inSum = 0
    var outSum = 0
    var mainChartClone = mainChart
    var mainChartOptsClone = mainChartOpts
    var cardChartData1Clone = cardChartData1
    var cardChartOpts1Clone = cardChartOpts1
    var cardChartData2Clone = cardChartData2
    var cardChartOpts2Clone = cardChartOpts2
    for (var i = 0; i < numberOfDay; i++) {
      dataMainChart.push(i + 1)
      dataInChart.push(0)
      dataOutChart.push(0)
    }
    for (i in data) {
      if (data[i].day <= numberOfDay) {
        if (data[i].status === 0) {
          dataInChart[data[i].day - 1] = data[i].countnumber
          inSum += data[i].countnumber
        } else {
          dataOutChart[data[i].day - 1] = data[i].countnumber
          outSum += data[i].countnumber
        }
      }
    }
    mainChartClone.labels = dataMainChart
    mainChartClone.datasets[0].data = dataInChart
    mainChartClone.datasets[1].data = dataOutChart
    mainChartOptsClone.scales.yAxes[0].ticks.max = 50
    mainChartOptsClone.scales.yAxes[0].ticks.stepSize = Math.ceil(50 / 5)

    cardChartData1Clone.labels = dataMainChart
    cardChartData1Clone.datasets[0].data = dataInChart
    cardChartOpts1Clone.scales.yAxes[0].ticks.min = 0
    cardChartOpts1Clone.scales.yAxes[0].ticks.max = Math.max.apply(Math, cardChartData1Clone.datasets[0].data) + 5

    cardChartData2Clone.labels = dataMainChart
    cardChartData2Clone.datasets[0].data = dataOutChart
    cardChartOpts2Clone.scales.yAxes[0].ticks.min = 0
    cardChartOpts2Clone.scales.yAxes[0].ticks.max = Math.max.apply(Math, cardChartData2Clone.datasets[0].data) + 5

    this.setState({
      mainChartState: mainChartClone,
      mainChartOptsState: mainChartOptsClone,
      cardChartData1State: cardChartData1Clone,
      cardChartData2State: cardChartData2Clone,
      cardChartOpts1State: cardChartOpts1Clone,
      cardChartOpts2State: cardChartOpts2Clone,
      inSum: inSum,
      outSum: outSum
    })
  }

  updateChartYear = (data) => {
    var dataInChart = []
    var dataOutChart = []
    var inSum = 0
    var outSum = 0
    var mainChartClone = mainChart
    var mainChartOptsClone = mainChartOpts
    var cardChartData1Clone = cardChartData1
    var cardChartOpts1Clone = cardChartOpts1
    var cardChartData2Clone = cardChartData2
    var cardChartOpts2Clone = cardChartOpts2
    for (var i = 0; i < 12; i++) {
      dataInChart.push(0)
      dataOutChart.push(0)
    }
    for (i in data) {
      if (data[i].status === 0) {
        dataInChart[data[i].month - 1] = data[i].countnumber
        inSum += data[i].countnumber
      } else {
        dataOutChart[data[i].month - 1] = data[i].countnumber
        outSum += data[i].countnumber
      }
    }
    mainChartClone.labels = monthName
    mainChartClone.datasets[0].data = dataInChart
    mainChartClone.datasets[1].data = dataOutChart
    mainChartOptsClone.scales.yAxes[0].ticks.max = 50
    mainChartOptsClone.scales.yAxes[0].ticks.stepSize = Math.ceil(50 / 5)

    cardChartData1Clone.labels = monthName
    cardChartData1Clone.datasets[0].data = dataInChart
    cardChartOpts1Clone.scales.yAxes[0].ticks.min = 0
    cardChartOpts1Clone.scales.yAxes[0].ticks.max = Math.max.apply(Math, cardChartData1Clone.datasets[0].data) + 5

    cardChartData2Clone.labels = monthName
    cardChartData2Clone.datasets[0].data = dataOutChart
    cardChartOpts2Clone.scales.yAxes[0].ticks.min = 0
    cardChartOpts2Clone.scales.yAxes[0].ticks.max = Math.max.apply(Math, cardChartData2Clone.datasets[0].data) + 5

    this.setState({
      mainChartState: mainChartClone,
      mainChartOptsState: mainChartOptsClone,
      cardChartData1State: cardChartData1Clone,
      cardChartData2State: cardChartData2Clone,
      cardChartOpts1State: cardChartOpts1Clone,
      cardChartOpts2State: cardChartOpts2Clone,
      inSum: inSum,
      outSum: outSum
    })
  }

  componentDidMount() {
    this.getHistoryByMonth({ params: { month: moment().format("MM"), year: moment().format("YYYY") } }).then(res => {
      this.updateChartMonth(res, moment().format("DD"))
    })
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardBody>
                <Row>
                  <Col sm="5">
                    <CardTitle className="mb-0">Park</CardTitle>
                    <div className="small text-muted">Dec 2018</div>
                  </Col>
                  <Col sm="7" className="d-none d-sm-inline-block">
                    <ButtonToolbar className="float-right" aria-label="Toolbar with button groups">
                      <Button color="outline-primary" onClick={this.onBtnClick}>Change Time</Button>
                    </ButtonToolbar>
                  </Col>
                </Row>
                <div className="chart-wrapper" style={{ height: 300 + 'px', marginTop: 40 + 'px' }}>
                  <Line data={this.state.mainChartState} options={this.state.mainChartOptsState} height={300} />
                </div>
              </CardBody>
              <CardFooter>
                <Row className="text-center">
                  <Col sm={12} md className="mb-sm-2 mb-0">
                    <strong>The statistical chart gets in and out of parking lots</strong>
                  </Col>
                </Row>
              </CardFooter>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xs="12" sm="6" lg="6">
            <Card className="text-white bg-info">
              <CardBody className="pb-0">
                <div className="text-value">{this.state.inSum}</div>
                <div>Cars come in</div>
              </CardBody>
              <div className="chart-wrapper mx-3" style={{ height: '70px' }}>
                <Line data={this.state.cardChartData1State} options={this.state.cardChartOpts1State} height={70} />
              </div>
            </Card>
          </Col>

          <Col xs="12" sm="6" lg="6">
            <Card className="text-white bg-info">
              <CardBody className="pb-0">
                <div className="text-value">{this.state.outSum}</div>
                <div>Cars go out</div>
              </CardBody>
              <div className="chart-wrapper mx-3" style={{ height: '70px' }}>
                <Line data={this.state.cardChartData2State} options={this.state.cardChartOpts2State} height={70} />
              </div>
            </Card>
          </Col>
        </Row>
        <Modal isOpen={this.state.chooseModalClick} toggle={this.onRemoveModal} className='modal-primary' >
          <ModalHeader toggle={this.onRemoveModal}>Choose a {this.state.chooseByYear ? "Year" : "Month"}</ModalHeader>
          <ModalBody>
            <Row>
              {!this.state.chooseByYear ? (
                <Col xs="12" md="4" >
                  <Input type="select" name={"monthSelect"} id={"monthSelect"} onChange={this.onChangeValue} defaultValue={this.state.monthSelect} placeholder="Choose Month" required>
                    {monthName.map((value1, key1) => (
                      <option key={key1} value={key1 + 1}>{value1}</option>
                    ))}
                  </Input>
                </Col>) : (null)}
              <Col xs="12" md="4" >
                <Input type="select" name={"yearSelect"} id={"yearSelect"} onChange={this.onChangeValue} defaultValue={this.state.yearSelect} placeholder="Choose Year" required>
                  {yearName.map((value1, key1) => (
                    <option key={key1} value={value1}>{value1}</option>
                  ))}
                </Input>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Row>
              <Col xs="12">
                <FormGroup check className="checkbox">
                  <Input className="form-check-input" type="checkbox" id="checkbox1" name="checkMonthOrYear" checked={this.state.chooseByYear} onChange={this.onChangeModal} />
                  <Label check className="form-check-label" htmlFor="checkbox1">Choose By Year</Label>
                </FormGroup>
              </Col>
            </Row>
            <Button color="primary" onClick={this.onSearchData}>View</Button>
            <Button color="secondary" onClick={this.onRemoveModal}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default Statistics;
