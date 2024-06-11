import React, { useEffect, useState, useRef } from "react";
import "../Style/Builder.css";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpDownLeftRight,
  faPenToSquare,
  faTrash,
  faBurger,
  faChampagneGlasses,
  faSquareCheck,
  faXmark,
  faCircleDown,
  faCircleUp,
} from "@fortawesome/free-solid-svg-icons";
import debounce from "lodash.debounce";

const images = [
  "Food-1",
  "Food-2",
  "Food-3",
  "Food-4",
  "Food-5",
  "Drink-2",
  "Drink-1",
];

function Builder() {
  const [menuItems, setMenuItems] = useState([
    {
      title: "Drinks",
      type: "line",
      edit: false,
    },
    {
      img: "Drink-1",
      description:
        "Description : Our product offers unmatched quality, reliability, and ease of use.",
      title: "Title",
      alergeni: "Ex: oat, corn",
      price: "10€",
      type: "item",
      changed: false,
      edit: false,
    },
    {
      img: "Drink-2",
      description:
        "Description : Our product offers unmatched quality, reliability, and ease of use.",
      title: "Title",
      alergeni: "Ex: oat, corn",
      price: "10€",
      type: "item",
      changed: false,
      edit: false,
    },
  ]);

  // notifications START
  const [notifications, setNotifications] = useState([]);

  const [currentTime, setCurrentTime] = useState(new Date().getTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const notification = (title, text, color) => {
    const current = new Date().getTime();
    const newItem = {
      title: title,
      text: text,
      color: color,
      timeStart: current,
      timeEnd: current + 3000,
    };

    setNotifications((notifications) => [...notifications, newItem]);
  };

  // notifications END

  //   resize for button START
  const a4SizeRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState(null);
  const [maxWidth, setMaxWidth] = useState(0);

  useEffect(() => {
    if (a4SizeRef.current) {
      setMaxWidth(a4SizeRef.current.clientWidth);
    }

    const handleResize = debounce(() => {
      if (a4SizeRef.current) {
        setMaxWidth(a4SizeRef.current.clientWidth);
        console.log(a4SizeRef.current.clientWidth);
      }
    }, 100);

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  //   resize for button END

  const setMenuItemIDs = (items) => {
    return items.map((item, index) => ({
      ...item,
      id: index + 1,
    }));
  };

  useEffect(() => {
    const updatedMenuItems = setMenuItemIDs(menuItems);
    setMenuItems(updatedMenuItems);
  }, []);

  const exportPDF = () => {
    if (!isEditing && !addStarted) {
      const container = document.getElementById("a4-content");
      container.style.height = "1850px";
      container.style.width = "1300px";

      let timer = 0;
      if (notifications.length > 0) {
        timer = 2000;
      }

      setTimeout(() => {
        html2canvas(container).then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF("p", "mm", "a4");
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
          pdf.save("download.pdf");
        });
      }, timer);

      setTimeout(() => {
        window.location.href = "./";
      }, timer + 1500);
    } else {
      notification("Warning!", "You are editing/adding an element.", "#f68635");
    }
  };

  const [isHovered, setIsHovered] = useState(null);
  const [hoveredID, sethoveredID] = useState(null);
  const [fadeOut, setfadeOut] = useState(null);

  const updateItemId = (newId, type) => {
    return () => {
      setfadeOut(newId);
      const updatedItems = [...menuItems];

      if (maxWidth < 697) {
        if (type === "up") {
          updatedItems[newId - 1].id = newId - 1;
        } else {
          updatedItems[newId - 1].id = newId + 1;
        }
        updatedItems[newId - 1].changed = true;
      } else {
        updatedItems[hoveredID - 1].id = newId;
        updatedItems[hoveredID - 1].changed = true;
      }
      const assignedIds = new Set(
        updatedItems.filter((item) => item.changed).map((item) => item.id)
      );
      let counter = 1;

      const finalItems = updatedItems.map((item) => {
        if (item.changed) {
          return item;
        } else {
          while (assignedIds.has(counter)) {
            counter += 1;
          }
          item.id = counter;
          assignedIds.add(counter);
          counter += 1;
          return item;
        }
      });

      const resetChangedItems = finalItems.map((item) => {
        item.changed = false;
        return item;
      });

      setMenuItems(resetChangedItems);
      setIsHovered(null);
      setToDrop(null);
      setTimeout(() => {
        setfadeOut(null);
      }, 1000);
    };
  };

  menuItems.sort((a, b) => a.id - b.id);

  const handleDragStart = (e, item) => {
    sethoveredID(item);
  };

  useEffect(() => {
    if (hoveredID !== null) {
      console.log(hoveredID);
    }
  }, [hoveredID]);

  const [isOver, setIsOver] = useState(false);
  const [toDrop, setToDrop] = useState(null);

  const handleDragOver = (e, item) => {
    e.preventDefault();
    if (!isOver) {
      setToDrop(item);
      setIsOver(true);
    }
  };

  const handleDragLeave = () => {
    setToDrop(null);
    setIsOver(false);
  };

  const deleteItem = (itemId) => {
    const height = a4SizeRef.current.clientHeight;
    setMaxHeight(height - 100);
    const updatedItems = menuItems.filter((item) => item.id !== itemId);
    setMenuItems(updatedItems);
    setChangeItem(false);
    setaddStarted(false);
    setIsEditing(false);

    notification("Succes!", "The element has been deleted.", "green");
  };

  //   EDIT ITEM START
  const [changeItem, setChangeItem] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [alergeni, setAlergeni] = useState("");
  const [price, setPrice] = useState("");
  const [img, setImg] = useState("");
  const [category, setCategory] = useState("");

  const changeTitle = (event) => {
    setTitle(event.target.value);
  };

  const changeDescription = (event) => {
    setDescription(event.target.value);
  };

  const changeAlergeni = (event) => {
    setAlergeni(event.target.value);
  };

  const changePrice = (event) => {
    setPrice(event.target.value);
  };

  const changeImg = (event) => {
    setImg(event.target.value);
  };

  const changeCategory = (event) => {
    setCategory(event.target.value);
  };

  const [isEditing, setIsEditing] = useState(false);

  const editItem = (itemId, title, description, alergeni, price, img) => {
    if (!changeItem && !addStarted) {
      setIsEditing(true);
      setChangeItem(true);
      const updatedItems = menuItems.map((item) =>
        item.id === itemId ? { ...item, edit: true } : item
      );
      setTitle(title);
      setDescription(description);
      setAlergeni(alergeni);
      setPrice(price);
      setImg(img);
      setMenuItems(updatedItems);
    } else {
      notification(
        "Warning!",
        "You are already editing/adding an element.",
        "#f68635"
      );
    }
  };

  const doneEditItem = (itemId) => {
    const updatedItems = menuItems.map((item) =>
      item.id === itemId
        ? {
            ...item,
            edit: false,
            title: title,
            description: description,
            alergeni: alergeni,
            price: price,
            img: img,
          }
        : item
    );
    setMenuItems(updatedItems);
    setTitle("");
    setDescription("");
    setAlergeni("");
    setPrice("");
    setImg("");

    setChangeItem(false);
    setIsEditing(false);
    setaddStarted(false);
    notification("Succes!", "The element has been edited / added.", "green");
  };

  const editCategory = (itemId, title) => {
    if (!changeItem && !addStarted) {
      setIsEditing(true);
      setChangeItem(true);
      const updatedItems = menuItems.map((item) =>
        item.id === itemId ? { ...item, edit: true } : item
      );

      setCategory(title);
      setMenuItems(updatedItems);
    } else {
      notification(
        "Warning!",
        "You are already editing/adding an element.",
        "#f6863"
      );
    }
  };

  const doneEditCategory = (itemId) => {
    const updatedItems = menuItems.map((item) =>
      item.id === itemId
        ? {
            ...item,
            edit: false,
            title: category,
          }
        : item
    );
    setMenuItems(updatedItems);
    setCategory("");

    setChangeItem(false);
    setIsEditing(false);
    setaddStarted(false);
    notification("Succes!", "The element has been edited / added.", "green");
  };

  const cancelEdit = (itemId) => {
    const updatedItems = menuItems.map((item) =>
      item.id === itemId
        ? {
            ...item,
            edit: false,
          }
        : item
    );
    setMenuItems(updatedItems);
    setChangeItem(false);
    setIsEditing(false);
  };
  //   EDIT ITEM END

  //   Background START
  const background = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/img/bg.png)`,
  };
  //   background END

  //   add item START
  const [addStarted, setaddStarted] = useState(false);

  const [isProduct, setisProductitem] = useState("item");
  const addType = (event) => {
    setisProductitem(event.target.value);
  };

  const addNewItem = () => {
    const height = a4SizeRef.current.clientHeight;
    const width = a4SizeRef.current.clientWidth;
    setMaxHeight(height);
    setMaxWidth(width);

    if (!addStarted && !isEditing && isProduct === "item") {
      if (maxHeight < 1700) {
        setaddStarted(true);
        const newItem = {
          id: menuItems.length + 1,
          title: "",
          type: isProduct,
          edit: true,
          img: "Food-1",
          description: "",
          alergeni: "",
          price: "",
        };

        setMenuItems([...menuItems, newItem]);
        setImg("Food-1");
        setTitle("Title");
        setDescription(
          "Description : Our product offers unmatched quality, reliability, and ease of use."
        );
        setAlergeni("Ex: oat, corn");
        setPrice("10€");
        // notification('Succes!', 'Element successfully added.', 'green');
      } else {
        notification(
          "Warning!",
          "You have reached the maximum limit of elements.",
          "#f68635"
        );
      }
    } else if (!addStarted && !isEditing && isProduct === "line") {
      if (maxHeight < 1700) {
        setaddStarted(true);
        const newItem = {
          id: menuItems.length + 1,
          title: "",
          type: isProduct,
          edit: true,
        };

        setMenuItems([...menuItems, newItem]);
        setCategory("Drinks");
        // notification('Succes!', 'Element successfully added.', 'green');
      } else {
        notification(
          "Warning!",
          "You have reached the maximum limit of elements.",
          "#f68635"
        );
      }
    } else {
      notification(
        "Warning!",
        "You are already editing/adding an element.",
        "#f68635"
      );
    }
  };
  //   add item END

  //   check height START

  //   check height END

  return (
    <>
      <div id="a4-content" className="a4-size row p-4" ref={a4SizeRef}>
        <div className="background" style={background}></div>
        <div className="all-notify col-10 col-md-6 col-lg-4">
          {notifications.map((item, index) =>
            currentTime < item.timeEnd ? (
              <div
                className="notify notify-in mb-1"
                key={index}
                style={{
                  borderColor: item.color,
                  boxShadow: `0 0 10px ${item.color}`,
                }}
              >
                <h1 style={{ color: item.color }}>{item.title}</h1>
                <p>{item.text}</p>
              </div>
            ) : null
          )}
        </div>
        <h1 className="name">Meniu</h1>
        <h2 className="restaurant">*Restaurant*</h2>
        {menuItems.map((item, index) =>
          item.type === "item" ? (
            <div
              className={`menu-content col-12 col-lg-6 mb-4 ${
                isHovered === item.id ? "hovered" : ""
              } ${fadeOut === item.id ? "fade-out" : ""} ${
                toDrop === item.id ? "to-drop" : ""
              }`}
              key={index}
              onMouseOver={() => setIsHovered(item.id)}
              onMouseOut={() => setIsHovered(null)}
              draggable
              onDragStart={(e) => handleDragStart(e, item.id)}
              onDragOver={(e) => handleDragOver(e, item.id)}
              onDragLeave={handleDragLeave}
              onDrop={updateItemId(item.id)}
            >
              {item.edit === true ? (
                <div className="edit-img col-8 col-md-3">
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    defaultValue={img}
                    onChange={changeImg}
                  >
                    {item.img !== img && (
                      <option value={item.img}>{item.img}</option>
                    )}
                    {images.map((image, index) => (
                      <option key={index} value={image}>
                        {image}
                      </option>
                    ))}
                  </select>

                  <img
                    src={`${process.env.PUBLIC_URL}/img/${
                      img === "" ? item.img : img
                    }.png`}
                    alt="Plate"
                    className="menu-img"
                  />
                </div>
              ) : (
                <img
                  src={`${process.env.PUBLIC_URL}/img/${item.img}.png`}
                  alt="Plate"
                  className="menu-img"
                />
              )}

              <div className="menu-details col-12 col-md-7">
                {item.edit === true ? (
                  <input
                    maxLength="25"
                    type="text"
                    className="form-control mb-1"
                    value={title}
                    onChange={changeTitle}
                  />
                ) : (
                  <h1 className="title">{item.title}</h1>
                )}

                {item.edit === true ? (
                  <textarea
                    maxLength="70"
                    className="form-control mb-1"
                    value={description}
                    onChange={changeDescription}
                  />
                ) : (
                  <h2 className="description">{item.description}</h2>
                )}

                {item.edit === true ? (
                  <input
                    maxLength="25"
                    type="text"
                    className="form-control mb-1"
                    value={alergeni}
                    onChange={changeAlergeni}
                  />
                ) : (
                  <p className="alergeni">{item.alergeni}</p>
                )}

                {item.edit === true ? (
                  <input
                    maxLength="15"
                    type="text"
                    className="form-control mb-1"
                    value={price}
                    onChange={changePrice}
                  />
                ) : (
                  <h3 className="price">{item.price}</h3>
                )}

                <div
                  className="controls"
                  style={{ display: item.edit ? "flex" : "" }}
                >
                  {maxWidth < 697 && !isEditing ? (
                    <>
                      {item.id !== 1 ? (
                        <span
                          rel="tooltip"
                          title="MoveUp"
                          onClick={updateItemId(item.id, "up")}
                        >
                          <FontAwesomeIcon icon={faCircleUp} />
                        </span>
                      ) : null}

                      {item.id !== menuItems.length ? (
                        <span
                          rel="tooltip"
                          title="MoveDown"
                          onClick={updateItemId(item.id, "down")}
                        >
                          <FontAwesomeIcon icon={faCircleDown} />
                        </span>
                      ) : null}
                    </>
                  ) : !isEditing ? (
                    <span rel="tooltip" title="Move">
                      <FontAwesomeIcon icon={faUpDownLeftRight} />
                    </span>
                  ) : null}

                  {item.edit === true ? (
                    <span
                      rel="tooltip"
                      title="Save"
                      onClick={() => doneEditItem(item.id)}
                    >
                      <FontAwesomeIcon icon={faSquareCheck} />
                    </span>
                  ) : (
                    <span
                      rel="tooltip"
                      title="Edit"
                      onClick={() =>
                        editItem(
                          item.id,
                          item.title,
                          item.description,
                          item.alergeni,
                          item.price,
                          item.img
                        )
                      }
                    >
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </span>
                  )}

                  {item.edit === true && isEditing ? (
                    <span
                      rel="tooltip"
                      title="Cancel"
                      onClick={() => cancelEdit(item.id)}
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </span>
                  ) : (
                    ""
                  )}

                  <span
                    rel="tooltip"
                    title="Delete"
                    onClick={() => deleteItem(item.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </span>
                </div>
              </div>
            </div>
          ) : item.type === "line" ? (
            <div
              className={`menu-line col-12 mt-2 mb-2 ${
                isHovered === item.id ? "hovered" : ""
              } ${toDrop === item.id ? "to-drop" : ""} ${
                menuItems[item.id - 2] && menuItems[item.id - 2].type === "line"
                  ? "mt-5 "
                  : ""
              }`}
              key={index}
              onMouseOver={() => setIsHovered(item.id)}
              onMouseOut={() => setIsHovered(null)}
              draggable
              onDragStart={(e) => handleDragStart(e, item.id)}
              onDragOver={(e) => handleDragOver(e, item.id)}
              onDragLeave={handleDragLeave}
              onDrop={updateItemId(item.id)}
            >
              <div className="line">
                {item.title === "Food" ? (
                  <span>
                    <FontAwesomeIcon icon={faBurger} />
                  </span>
                ) : (
                  <span>
                    <FontAwesomeIcon icon={faChampagneGlasses} />
                  </span>
                )}

                {item.edit === true ? (
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    defaultValue={item.title}
                    onChange={changeCategory}
                  >
                    <option value="Drinks">Drinks</option>
                    <option value="Food">Food</option>
                  </select>
                ) : (
                  <h1>{item.title}</h1>
                )}
              </div>

              <div
                className="controls"
                style={{ display: item.edit ? "flex" : "" }}
              >
                {maxWidth < 697 && !isEditing ? (
                  <>
                    {item.id !== 1 ? (
                      <span
                        rel="tooltip"
                        title="MoveUp"
                        onClick={updateItemId(item.id, "up")}
                      >
                        <FontAwesomeIcon icon={faCircleUp} />
                      </span>
                    ) : null}

                    {item.id !== menuItems.length ? (
                      <span
                        rel="tooltip"
                        title="MoveDown"
                        onClick={updateItemId(item.id, "down")}
                      >
                        <FontAwesomeIcon icon={faCircleDown} />
                      </span>
                    ) : null}
                  </>
                ) : !isEditing ? (
                  <span rel="tooltip" title="Move">
                    <FontAwesomeIcon icon={faUpDownLeftRight} />
                  </span>
                ) : null}

                {item.edit === true ? (
                  <span
                    rel="tooltip"
                    title="Save"
                    onClick={() => doneEditCategory(item.id)}
                  >
                    <FontAwesomeIcon icon={faSquareCheck} />
                  </span>
                ) : (
                  <span
                    rel="tooltip"
                    title="Edit"
                    onClick={() => editCategory(item.id, item.title)}
                  >
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </span>
                )}

                {item.edit === true && isEditing ? (
                  <span
                    rel="tooltip"
                    title="Cancel"
                    onClick={() => cancelEdit(item.id)}
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </span>
                ) : (
                  ""
                )}

                <span
                  rel="tooltip"
                  title="Delete"
                  onClick={() => deleteItem(item.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </span>
              </div>
            </div>
          ) : null
        )}
      </div>
      <div className="builder-footer">
        <div className="add-item row mb-5">
          <h4>Add Item</h4>

          <select
            className="form-select mb-2"
            aria-label="Select type"
            defaultValue={isProduct}
            onChange={addType}
          >
            <option value="item">Product</option>
            <option value="line">Category</option>
          </select>

          <button className="add-item-controls mb-3 col-6" onClick={addNewItem}>
            ADD
          </button>
        </div>

        {maxWidth > 1230 ? (
          <button className="export" onClick={exportPDF}>
            Export to PDF
          </button>
        ) : (
          <h4 className="mb-5">
            To export, the screen must be larger than 1230 pixels.
          </h4>
        )}
      </div>
    </>
  );
}

export default Builder;
