/*****
    This is to put things that you want globally in each test.
    Jest runs off of jsDOM, so it doesn't have a browser to use browser-specific
    things, like Window, or LocalStorage.
*****/

// Local Storage Mock
const mock = () => {
    let storage = {};
    return {
        getItem: key => key in storage ? storage[key] : null,
        setItem: (key, value) => storage[key] = value || '',
        removeItem: key => delete storage[key],
        clear: () => storage = {},
    };
};

Object.defineProperty(window, 'localStorage', { value: mock() });
Object.defineProperty(window, 'sessionStorage', { value: mock() });

