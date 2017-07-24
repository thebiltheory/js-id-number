import React from 'react';
import ReactDOMServer from 'react-dom/server';
import CopyToClipboard from "react-copy-to-clipboard";
import ReactTooltip from 'react-tooltip'

import JsonTable from './JsonTable';

import IDNumber from '../../';


export default class GenerationBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      country: null,
      idType: null,
      resultList: []
    };

    this.generateNewIdNumbers = this.generateNewIdNumbers.bind(this);
  }

  generateNewIdNumbers() {
    if (!(this.state.country && this.state.idType)) {
      this.setState({resultList: []});
      return;
    }
    const generator = IDNumber.getGenerator(this.state.country.value, this.state.idType.value);
    let resultList = [];
    for (let i = 0; i < 10; i++) {
      resultList.push(generator());
    }
    resultList = resultList.filter((v) => !!v);
    this.setState({resultList})
  }

  displayDocumentType() {
    if (this.state.country && this.state.idType) {
      return this.state.country.label + ' ' + this.state.idType.label;
    }
    return 'ID Number';
  }


  setCountryAndIdType(country, idType) {
    this.setState({country, idType});
    this.generateNewIdNumbers();
  }


  render() {
    setTimeout(() => {
      ReactTooltip.rebuild();
    }, 0);
    return (
      <div className="id-number-generation-area">
        <h2>{this.displayDocumentType()} Generation</h2>
        {
          (() => {
            if (!this.state.idType) {
              return (
                <p>Please select document type.</p>
              )
            } else if (!this.state.resultList.length) {
              return (
                <p>Sorry, currently there is no generator available.</p>
              )
            } else {
              return (
                <ul className="id-number-list">
                  {
                    this.state.resultList.map((idNumber) => {
                      return (
                        <CopyToClipboard key={idNumber.value}
                                         text={idNumber.value}
                                         onCopy={() => alert('Copied to clipboard!')}>
                          <li data-tip={ReactDOMServer.renderToStaticMarkup(JsonTable(idNumber.extra))}>{idNumber.value}</li>
                        </CopyToClipboard>
                      )
                    })
                  }
                </ul>
              )
            }
          })()
        }
        <ReactTooltip html={true} />
      </div>
    )
  }
}
