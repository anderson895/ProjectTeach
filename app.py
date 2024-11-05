from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def landingls():
    message = "Hello, this message is dynamic!"
    return render_template('index.html', message=message)

@app.route('/admin/login')
def admin_login():
    return render_template('admin/login.html')

if __name__ == '__main__':
    app.run(port=5001)
