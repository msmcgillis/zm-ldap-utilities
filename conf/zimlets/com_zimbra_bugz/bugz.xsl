<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="bugzilla">
    <html>
      <xsl:apply-templates/>
    </html>
  </xsl:template>
  <xsl:template match="bug">
    <div><b>ID: </b>          <xsl:value-of select="bug_id"/></div>
    <div><b>Status: </b>      <xsl:value-of select="bug_status"/></div>
    <div><b>Priority: </b>    <xsl:value-of select="priority"/></div>
    <div><b>Severity: </b>    <xsl:value-of select="bug_severity"/></div>
    <div><b>Product: </b>     <xsl:value-of select="product"/></div>
    <div><b>Component: </b>   <xsl:value-of select="component"/></div>
    <div><b>Version: </b>     <xsl:value-of select="version"/></div>
    <div><b>Reporter: </b>    <xsl:value-of select="reporter"/></div>
    <div><b>Owner: </b>       <xsl:value-of select="assigned_to"/></div>
    <div><b>Description: </b> <xsl:value-of select="short_desc"/></div>
  </xsl:template>
</xsl:stylesheet>
