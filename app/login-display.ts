import { HttpServlet } from "@servlet/http-servlet"
import { IncomingMessage, ServerResponse } from "node:http"
import {getRequestDispatcher, RequestDispatcher} from "@servlet/dispatcher";

export class LoginDisplayServlet extends HttpServlet {
    protected doGet(req: IncomingMessage, res: ServerResponse) {
        getRequestDispatcher(loginDisplayDispatcher, []).forward(req, res)
    }
}

const loginDisplayDispatcher: RequestDispatcher = () => `
<h1>Login</h1>
<form>
    <div>
        ID: <input id="user_id">
    </div>
    <div>
        パスワード: <input id="password" type="password">
    </div>
    <div>
        <button type="submit">ログイン</button>
    </div>
</form>
`
