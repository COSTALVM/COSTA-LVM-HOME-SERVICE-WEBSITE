const http=require('http'),fs=require('fs'),path=require('path'),url=require('url');
const ROOT='C:\\Users\\felipefreitas_trajet\\Desktop\\COSTA LVM HOME SERVICE\\site';
const T={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.webp':'image/webp','.woff2':'font/woff2','.svg':'image/svg+xml','.xml':'application/xml','.txt':'text/plain; charset=utf-8','.json':'application/json','.jpg':'image/jpeg','.png':'image/png','.mp4':'video/mp4'};
http.createServer((req,res)=>{
  let p=decodeURIComponent(url.parse(req.url).pathname);
  let f=path.join(ROOT,p);
  try{ if(fs.statSync(f).isDirectory()) f=path.join(f,'index.html'); }
  catch(e){ f=path.join(ROOT,'404.html'); res.statusCode=404; }
  let st; try{ st=fs.statSync(f); }catch(e){ res.statusCode=404; return res.end('not found'); }
  const type=T[path.extname(f)]||'application/octet-stream';
  const range=req.headers.range;
  if(range && /^bytes=/.test(range)){
    const [s,e]=range.replace('bytes=','').split('-');
    const start=parseInt(s,10)||0;
    const end=e?parseInt(e,10):st.size-1;
    res.writeHead(206,{'Cache-Control':'no-store','Content-Type':type,'Accept-Ranges':'bytes','Content-Range':`bytes ${start}-${end}/${st.size}`,'Content-Length':end-start+1});
    return fs.createReadStream(f,{start,end}).pipe(res);
  }
  res.writeHead(res.statusCode===404?404:200,{'Cache-Control':'no-store','Content-Type':type,'Accept-Ranges':'bytes','Content-Length':st.size});
  fs.createReadStream(f).pipe(res);
}).listen(4321,()=>console.log('serving :4321 (com Range)'));

