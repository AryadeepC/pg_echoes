### HTML

```
    <div id="dialog_box" className={styles.modal}>
        <div className={styles.modal_content}>
            <span className={styles.close} onClick={closeAlert}>
                &times;
            </span>
            <p>{errMsg}</p>
        </div>
    </div>
```

### JavaScript

```
function showAlert(msg) {
    if (!msg) return;
    setErrMsg(msg);
    document.getElementById("dialog_box").style.display = "block";
}

function closeAlert() {
    document.getElementById("dialog_box").style.display = "none";
    if (errMsg === "Registration complete ✅") {
      navigate("/login");
    }
}

```

### CSS

```

.modal {
  display: none;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}
.modal_content {
  font-family: "JetBrains Mono";
  font-size: 28px;
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  text-align: center;
  border-radius: 15px;
  position: relative;
}
.close {
  color: #aaaaaa;
  position: absolute;
  top: 0;
  right: 0;
  font-size: 28px;
  font-weight: bold;
  padding: 5px 15px;
  cursor: pointer;
}
.close:hover {
  transform: scale(1.5);
}

```
