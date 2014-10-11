require "sinatra"
require "json"

set :public_folder, 'public'	

get "/" do
  redirect '/index.html'
end

post "/upload/:id" do |id|
	if id.to_s.length
		File.open('public/images/' + "#{params[:id]}.jpg", "wb") do |f|
		  f.write(params['webcam'][:tempfile].read)
		end 
	end
	return "success"
end

get "/images" do
	puts "images called"
	puts params.inspect
	files = Array.new
	Dir.new("public/images").each do |file|
		files << file unless File.directory?(file)
	end
	return files.to_json
end