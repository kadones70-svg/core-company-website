<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" />
  <xsl:template match="/">
    <html lang="ko"><head><title>Core Company Blog RSS</title><meta name="viewport" content="width=device-width, initial-scale=1" /><style>body{max-width:760px;margin:64px auto;padding:0 24px;font:16px/1.7 system-ui,sans-serif;color:#1a1917;background:#f8f7f4}h1{font-size:40px}article{padding:24px 0;border-top:1px solid #d9d4cb}a{color:#1e56c8}small{color:#6e6a63}</style></head><body><h1>Core Company Blog</h1><p>RSS 구독 피드입니다. 블로그 화면은 <a href="https://corecompany.net/blog/">여기</a>에서 볼 수 있습니다.</p><xsl:for-each select="rss/channel/item"><article><h2><a><xsl:attribute name="href"><xsl:value-of select="link" /></xsl:attribute><xsl:value-of select="title" /></a></h2><p><xsl:value-of select="description" /></p><small><xsl:value-of select="pubDate" /></small></article></xsl:for-each></body></html>
  </xsl:template>
</xsl:stylesheet>
