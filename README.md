<h1>Hacker Hub</h1>

This is a proxy.

<h1>Deploying</h1>

When using this proxy, 6 enviormental variables must be configured.
<ol>
    <li>
        <h2 name="debug">debug</h2>
        <p>debug, like blacklist, will only be used if tracking is enabled. This variable will receive to inputs. Either 'true' or 'false' will be used. When active, all requests, including simple CSS and Javascript, will be printed to console. It also prints important information like proxy requests.</p>
        <p>NOTE: This will not print requests to websites, as that is unethical and has been coded to prevent such information. Even if it was printed, the url would be encoded.</p>
    </li>
    <li>
        <h2 name="headers">headers</h2>
        <p>headers, like debug, it uses 'true' or 'false' values. When active, it prints all http headers requested, but only if <a href="#tracker">tracker</a> is enabled.</p>
    </li>
    <li>
        <h2 name="dbPassword">dbPassword</h2>
        <p>the dbPassword is the password for the mongoDB database.</p>
    </li>
    <li>
        <h2 name="tracker">tracker</h2>
        <p>This is a true/false variable.</p>
    </li>
</ol>
