import React, { useEffect, useState } from "react";
import { fetchWithCSRFToken } from "../utils/fetch";
import NodeAdd from "./NodeAdd";
import NodeEdit from "./NodeEdit";
import NodeDelete from "./NodeDelete";

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

const NodeItem = ({id, drupal_internal_nid, title, body, contentlist, updateContent}) => {
  const [showAdminOptions, setShowAdminOptions] = useState(false);

  function handleClick(event){
    event.preventDefault();
    setShowAdminOptions(!showAdminOptions);
  }

  function onEditSuccess(data) {
    //replace the edited item in list with updated values
    const idx = contentlist.findIndex(item => item.id === data.id);
    console.log('index',{idx,data,content:contentlist});
    contentlist[idx] = data;
    updateContent([...contentlist])
  }

  function onDeleteSuccess(id){
    //remove the deleted item from list
    const list = contentlist.filter(item => item => item.id !== id )
    updateContent([...list]);
  }
//show item with admin options
  if(showAdminOptions){
    return(
      <div>
        <hr/>
        Admin options for {title}
        <NodeEdit
          id={id}
          title={title}
          body={body}
          onSucces={onEditSuccess}
          />
        <hr/>
        <button onClick={handleClick}>
          cancel
        </button>
        <NodeDelete
          id={id}
          title={title}
          onSuccess={onDeleteSuccess}
          />
        <hr/>
      </div>
    );
  }
  //show just the item
  return (
    <div>
      <a href={'/node/${drupal_internal__nid}'}>{title}</a>
      {" -- "}
      <button onClick={handleClick}>
        edit
      </button>
    </div>
  );
};

const NoData = () => (
  <div>No articles found.</div>
);

//display drupal nodes with admin feats
const NodeReadWrite = () => {
  const [content, updateContent] = useState([]);
  const [filter, setFilter] = useState(null);
  const [showNodeAdd, setShowNodeAdd] = useState(false);

  useEffect(() => {
    const API_ROOT = '/Drupal-React-Prototype/web/jsonapi/';
    const url = `${API_ROOT}node/article?fields[node--article]=id,drupal_internal__nid,title,body&sort=-created&page[limit]=10`;

    const headers = new Headers({
      Accept: 'application/vnd.api+json',
    });
  })
}
fetchWithCSRFToken(url, {headers})
  .then((response) => response.json())
  .then((data) => {
    if (isValidData(data)) {
      // Initialize the list of content with data retrieved from Drupal.
      updateContent(data.data);
    }
  })
  .catch(err => console.log('There was an error accessing the API', err));
}, []);

// Handle updates to state when a node is added.
function onNodeAddSuccess(data) {
  // Add the new item to the top of the list.
  content.unshift(data);
  // Note the use of [...content] here, this is because we're
  // computing new state based on previous state and need to use a
  // functional update. https://reactjs.org/docs/hooks-reference.html#functional-updates
  // [...content] syntax creates a new array with the values of
  // content, and updates the state to that new array.
  updateContent([...content]);
}

return (
  <div>
    <h2>Site content</h2>
    {content.length ? (
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
          // If there's a `filter` apply it to the list of nodes.
          content.filter((item) => {
            if (!filter) {
              return item;
            }

            if (filter && (item.attributes.title.toLowerCase().includes(filter) || item.attributes.body.value.toLowerCase().includes(filter))) {
              return item;
            }
          }).map((item) => (
            <NodeItem
              key={item.id}
              id={item.id}
              updateContent={updateContent}
              contentList={content}
              {...item.attributes}
            />
          ))
        }
      </>
    ) : (
      <NoData />
    )}
    <hr />
    {showNodeAdd ? (
      <>
        <h3>Add a new article</h3>
        <NodeAdd
          onSuccess={onNodeAddSuccess}
        />
      </>
    ) : (
      <p>
        Don't see what you're looking for?
        <button onClick={() => setShowNodeAdd(true)}>Add a node</button>
      </p>
    )}
  </div>
);
};

export default NodeReadWrite;
