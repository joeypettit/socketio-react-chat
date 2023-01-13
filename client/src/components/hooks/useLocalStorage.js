// this hook will take a value and place it into local storage
// if there is already a value with that key in local storage,
// it will return that value instead.

import { useEffect, useState } from "react";

// this PREFIX is useful when you have multiple apps using local
// storage from the same url (eg localhost:3000)
// the prefix allows you to keep each one seperate, and
// avoid conflicts with keys
const PREFIX = "whatsapp-clone-";

function useLocalStorage(key, initialValue) {
  // combine key with the PREFIX
  const prefixedKey = PREFIX + key;

  // if value already exists in local storage, use that value
  const [value, setValue] = useState(() => {
    //grab value from local storage
    const jsonValue = localStorage.getItem(prefixedKey);
    console.log(`jsonValue`, jsonValue);
    // if the value DOES exist, set to default state value
    if (jsonValue !== null) {
      return JSON.parse(jsonValue);
    }
    // if the second argument is a funciton, that means
    // we are using the function version of use stateState
    // we want to just invoke that function
    if (typeof initialValue === "function") {
      return initialValue();
      // if it's just a regular value, set that to default state
    } else {
      return initialValue;
    }
  });

  // every time the prefixedKey and/or the state value changes,
  // we will set the new value to local storage
  useEffect(() => {
    //
    console.log(`useEffect`, value);
    localStorage.setItem(prefixedKey, JSON.stringify(value));
  }, [prefixedKey, value]);

  // return values from state
  return [value, setValue];
}

export default useLocalStorage;
