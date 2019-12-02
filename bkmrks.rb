# encoding: UTF-8
#!/usr/bin/ruby
#
# @package Bkmrks
# @file Backend service
# @copyright (c) 2019, Christoph Kappel <unexist@subforge.org>
# @version $Id$
#
# This program can be distributed under the terms of the GNU GPL.??
# See the file COPYING
#

require "sinatra"
require "sinatra/multi_route"
require "sinatra/reloader"
require "sinatra/json"
require "sinatra/cross_origin"
require "json"
require "sequel"
require "sqlite3"
require "uri"

# Config
set :port, 7000
enable :inline_templates

configure do
    enable :cross_origin
end

before do
    response.headers["Access-control-Allow-Origin"] = "*"

    # Json body
    request.body.rewind
    @request_payload = request.body.read
end

# Database
DB = Sequel.sqlite("bkmrks.db")

DB.create_table? :bookmarks do
    primary_key :id
    foreign_key :tag_id, :tags

    String :uri, unique: true, null: false

    DateTime :created_at, default: Sequel::CURRENT_TIMESTAMP
    DateTime :checked_at, default: Sequel::CURRENT_TIMESTAMP
end

DB.create_table? :tags do
    primary_key :id

    String :name, unique: true, null: false

    DateTime :created_at, default: Sequel::CURRENT_TIMESTAMP
end

# Models
class Bookmark < Sequel::Model
end

class Tag < Sequel::Model
end

# Routes
get "/bookmarks" do
    bookmarks = Bookmark.all || []

    json bookmarks.map { |b| b.to_hash }
end

get "/bookmarks/:tagid" do
    bookmarks = Bookmark.where(tag_id: params[:tagid]).all || []

    json bookmarks.map { |b| b.to_hash }
end

get "/tags" do
    tags = Tag.all || []

    json tags.map { |t| t.to_hash }
end

post "/check" do
    validateUri @request_payload do |uri|
        bookmark = Bookmark.where(uri: uri).first

        bookmark.nil? ? 200 : 409
    end
end

post "/*" do
    validateUri @request_payload do |uri|
        begin
            bookmark = Bookmark.new do |b|
                b.uri = uri
                b.save
            end

            json bookmark.to_hash
        rescue Sequel::UniqueConstraintViolation => e
            409
        rescue Sequel::Error => e
            p e

            500
        end
    end
end

def validateUri(uristr)
    uri = URI.parse uristr rescue nil

    if uri.kind_of? URI::HTTP and uri.kind_of? URI::HTTPS and !uri.host.nil?
        yield uri.to_s
    else
        406
    end
end

options "*" do
    response.headers["Allow"] = "GET, PUT, POST, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Authorization, Content-Type, Accept, X-User-Email, X-Auth-Token"
    response.headers["Access-Control-Allow-Origin"] = "*"

    200
end