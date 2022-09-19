import {useEffect, useState} from "react";
require('react-dom');
window.React2 = require('react');
console.log(window.React1 === window.React2);

const NodeItem = ({drupal_internal__nid, title}) => (
  <div>
    <a href={`/node/${drupal_internal__nid}`}>{title}</a>
  </div>
);
const NoData = () => (
  <div>No articles found</div>
);

const [filter, setFilter] = useState(null);

const NodeListOnly = () => {
  const [content, setContent] = useState(false);

  useEffect(() => {
    const API_ROOT = '/drupal-try-again/web/jsonapi/';
    const url = `${API_ROOT}node/article?fields[node--article]=id,drupal_internal__nid,title,body&sort=-created&page[limit]=10`;

    const headers = new Headers({
      Accept: 'application/vnd.api+json',
    });
    fetch(url, {headers})
      .then((response) => response.json())
      .then((data) => {
        if (isValidData(data)) {
          setContent(data.data)
        }
      })
      .catch(err => console.log('There was an error accessing the API', err));
  }, []);


  return (
    <div>
      <h2>Site content</h2>
      {content ? (
        <>
          <label htmlFor="filter">Type to filter:</label>
          <input
            type="text"
            name="filter"
            placeholder="Start typing ..."
            onChange={(event => setFilter(event.target.value.toLowerCase()))}
          />
          <hr/>
          {
            content.filter((item) => {
              if (!filter) {
                return item;
              }

              if (filter && (item.attributes.title.toLowerCase().includes(filter.toString()) || item.attributes.body.value.toLowerCase().includes(filter.toString()))) {
                return item;
              }
            }).map((item) => <NodeItem key={item.id} {...item.attributes}/>)
          }
        </>
      ) : (
        <NoData />
      )}
    </div>
  );
};

export default NodeListOnly

function isValidData(data) {
  if (data === null) {
    return false;
  }
  if (data.data === undefined ||
    data.data === null ||
    data.data.length === 0 ) {
    return false;
  }
  return true;
}