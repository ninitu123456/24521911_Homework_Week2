
# AI Failure Audit

**Student:** Nguyen Ngoc Thien Tu
**Student ID:** 24521911
**Repository:** 24521911_Homework

## Vulnerability 01: Unsafe innerHTML

### Risk
Using innerHTML with untrusted text can cause XSS.

### Vulnerable Code
```javascript
container.innerHTML = userInput;
```

### Secure Fix
```javascript
container.textContent = userInput;
```

### Verification
Open DevTools and inspect the Elements panel.
Verify that user input is displayed as text,
not interpreted as executable HTML.

### Evidence
Add screenshot and actual test results here.

## Vulnerability 02: Event Listener Leak

### Risk
Attaching event listeners during every render
may create duplicate listeners or retain old nodes.

### Vulnerable Code
```javascript
button.addEventListener("click", handler);
```

### Engineering Fix
Use root Event Delegation with a single
listener for each supported event type.

### Verification
Inspect Event Listeners in Chrome DevTools.
Confirm child buttons have no direct listeners.

### Evidence
Add screenshot and actual test results here.

## Vulnerability 03: Unstable Keys

### Risk
Random keys can force unnecessary DOM replacement.

### Vulnerable Code
```javascript
const key = Math.random();
```

### Engineering Fix
Use a stable unique task ID.

```javascript
const key = task.id;
```

### Verification
Inspect DOM identity across re-renders.
Confirm stable item identity after updates.

### Evidence
Add screenshot and actual test results here.
