using MongoDB.Driver;
using MongoDB.Bson;
using DentApi.Models;
using DentApi.Extensions;
using MongoDB.Bson.Serialization.Serializers;
using MongoDB.Bson.Serialization;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

DotNetEnv.Env.Load();
var mongoUri = Environment.GetEnvironmentVariable("MONGO_URI");
var mongoDbName = Environment.GetEnvironmentVariable("MONGO_DB");

var mongoClient = new MongoClient(mongoUri);
var mongoDatabase = mongoClient.GetDatabase(mongoDbName);

builder.Services.AddSingleton(mongoDatabase);
builder.Services.RegisterServices();
builder.Services.AddControllers();

var pacijentiKolekcija = mongoDatabase.GetCollection<Pacijent>("pacijenti");
var indexModel = new CreateIndexModel<Pacijent>(
    Builders<Pacijent>.IndexKeys.Ascending(p => p.Jmbg),
    new CreateIndexOptions { Unique = true }
);
await pacijentiKolekcija.Indexes.CreateOneAsync(indexModel);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
BsonSerializer.RegisterSerializer(new DecimalSerializer(BsonType.Double));
var app = builder.Build();

app.UseCors();
app.UseHttpsRedirection();
app.UseSwagger();
app.UseSwaggerUI();
app.MapControllers();


app.Run();