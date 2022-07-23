import {Renderer} from "@servlet/renderer";

export const login: Renderer<void> = () => `
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
