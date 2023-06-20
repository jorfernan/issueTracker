import React from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';



const IssueRow = withRouter(({issue,location: {search}}) => {
  const selectLocation = { pathname: `/issues/${issue.id}`, search };
  const {
    id,
    status,
    owner,
    created,
    effort,
    due,
    title,
  } = issue;
  return (
    <tr>
      <td>{id}</td>
      <td>{status}</td>
      <td>{owner}</td>
      <td>{created.toDateString()}</td>
      <td>{effort}</td>
      <td>{due ? due.toDateString() : ''}</td>
      <td>{title}</td>
      <td>
        <Link to={`/edit/${issue.id}`}>Edit</Link>
        {' | '}
        <NavLink to={selectLocation}>Select</NavLink>
      </td>
    </tr>
  );
});

export default function IssueTable({ issues }) {
  const issueRows = issues.map(issue => (
    <IssueRow key={issue.id} issue={issue} />
  ));
  return (
    <table className="bordered-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Status</th>
          <th>Owner</th>
          <th>Created</th>
          <th>Effort</th>
          <th>Due Date</th>
          <th>Title</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>{issueRows}</tbody>
    </table>
  );
}
