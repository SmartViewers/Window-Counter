import os
#import magic
import urllib.request
from app import app
from flask_cors import CORS, cross_origin
from flask import Flask, flash, request, redirect, render_template, jsonify, json
from werkzeug.utils import secure_filename
import io
import cv2
import numpy as np
from werkzeug.local import Local, LocalProxy
from werkzeug.datastructures import ImmutableMultiDict
import base64
from PIL import Image
import numpy as np
from blur_image import process

ALLOWED_EXTENSIONS = set([ 'png', 'jpg', 'jpeg', 'gif'])

def allowed_file(name):
	return '.' in name and name.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

	
@app.route('/')
def upload_form():
	return render_template('upload.html')

@app.route('/uploadimage', methods=['GET', 'POST'])
@cross_origin()
def upload_file():
	print('Qwertubb ino ')
	#request = LocalProxy(local, 'request')
	print("request is ", request.files)
	content_length = request.content_length
	print(f"Content_length : {content_length}")
	print("data type is ", type(request))
	print("data type of request files  ", type(request.files))
	data_dict = request.form.to_dict()
	#print(type(data_dict))
	#print(data_dict['file'])
	data = (data_dict['file'].split(',')[1])
	#print(len(data_dict))
	#print(data)
	imgdata = base64.b64decode(data)
	print("imagedata type is" , type(imgdata))
	img2 = Image.open(io.BytesIO(imgdata))
	print(type(img2))
	#img2.show()
	#img = cv2.imread(img2)
	#print('opencv type' , type(img))
	#print(type(img))
	a = np.array(img2.getdata()).astype(np.float64)
	print(type(a))
	print(a.shape)

	data = process(a)
	data = data.reshape(600, 800, 3)
	print('final data shape ', data.shape)
	cv2.imshow('image', data)
	cv2.waitKey()
	
	#data = request.files['file']
	
	#inp= io.BytesIO()
	#imagefile.save(inp)
	#img = np.fromstring(inp.getvalve(), dtype=np.float32)
	#img1 = cv2.imdecode(img, 1)
	if request.method == 'POST':
        # check if the post request has the file part
		if 'file' not in request.files:
			flash('No file part')
			print(request)
			return jsonify({'text': 'No File'})
		file = request.files['file']
		if file.name == '':
			print('Second loop')
			flash('No file selected for uploading')
			return jsonify({'text':' Contains No file'})
		if file and allowed_file(file.name):
			print(' Last loop')
			filename = secure_filename(file.name)
			file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
			flash('File successfully uploaded')
			return jsonify({'text':'File Uploaded'})
		else:
			flash('Allowed file types are png, jpg, jpeg, gif')
			return redirect('/')

if __name__ == "__main__":
    app.run(debug=True)
