export const apiHelper = async (method, url, ...args) => {
    const baseUrl = 'https://private-anon-f475112004-grchhtml.apiary-mock.com';
    const params = args.find(item => item.params)?.params;
    const requestUrl = new URL(`${baseUrl}/${url}${(params ? '?' + new URLSearchParams(params) : '')}`);

    const options = {
        method: method.toUpperCase(),
        headers: {
            'Content-Type': 'application/json',
        },
        body: method === 'get' && params ? null : JSON.stringify(args[0])
    };

  
    try {
        const response = await fetch(requestUrl, options);
  
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
  
        return data;
    } catch (err) {
        alert(err);
        return null;
    }
};