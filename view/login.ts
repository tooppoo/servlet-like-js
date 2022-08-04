import {Renderer} from "@servlet/renderer";

interface LoginAttr {
    errorMessage?: string
}

const login: Renderer<LoginAttr> = attr => `
<h1>Login</h1>
<div class="error">
    ${attr.errorMessage || ''}
</div>
<form method="POST" action="login-process">
    <div>
        ID: <input name="loginId" type="text">
    </div>
    <div>
        パスワード: <input name="password" type="password">
    </div>
    <div>
        <button type="submit">ログイン</button>
    </div>
</form>
`
export default login
