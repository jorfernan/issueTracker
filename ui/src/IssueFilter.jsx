/* eslint "react/prefer-stateless-function": "off" */

import React from 'react';

export default class IssueFilter extends React.Component {
  render() {
    return (
      <div>
        <a href="/#/issues">All issues</a>
        <a href="/#/issues?status=New">New issues</a>
        <a href="/#/issues?status=Assigned">Assigned issues</a>
      </div>
    );
  }
}
