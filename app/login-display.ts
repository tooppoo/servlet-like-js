import { HttpServlet } from "@servlet/http-servlet"
import { ServerResponse } from "node:http"
import {HttpRequest} from "@servlet/request";

export class LoginDisplayServlet extends HttpServlet {
    protected doGet(req: HttpRequest, res: ServerResponse): Promise<void> {
        return req.getRequestDispatcher('login.ts#login').forward(req, res)
    }
}
