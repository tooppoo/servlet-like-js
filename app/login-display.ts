import { HttpServlet } from "@servlet/http-servlet"
import { ServerResponse } from "node:http"
import {getRequestDispatcher, RequestDispatcher} from "@servlet/dispatcher";
import {HttpRequest} from "@servlet/request";

export class LoginDisplayServlet extends HttpServlet {
    protected doGet(req: HttpRequest, res: ServerResponse) {
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
