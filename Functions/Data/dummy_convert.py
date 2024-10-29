import re
from bs4 import BeautifulSoup

# Malformed HTML input
html_content = '''
KARACHI: Citing Pakistan�s growth rate, one of the world's largest professional-services firms, PricewaterhouseCoopers, have ranked Pakistan to be among top 20 powerful economies by 2030 and 16th by 2050.The <a href=""https://www.pwc.com/gx/en/world-2050/assets/pwc-world-in-2050-summary-report-feb-2017.pdf"">PWC released its predictions for the 32 most powerful economies </a>in the world by 2050, based on their projected Gross Domestic Product by Purchasing Power Parity (PPP).The report, titled ""The long view: how will the global economic order change by 2050?"" ranked 32 countries by their projected global gross domestic product by purchasing power parity.Purchasing Power Parity (PPP) is an economic theory that compares different countries' currencies through a market ""basket of goods"" approach. PPP determines the economic productivity and standards of living of various countries over a period. Since market exchange rates fluctuate substantially, many economists consider PPP as a more precise way of estimating a country�s economy.The consulting firm also predicted 2050 GDP numbers based on market exchange ratings, an alternative method for GDP calculation. In these rankings, the US will lose global dominance by 2030, and the gap will only grow by 2050 with China having a nearly $50 trillion GDP, and the US having the same $34.1 trillion.Following is the list of top 32 economies by 2030:01. China � $38.008 trillion<br/>02. United States � $23.475 trillion<br/>03. India � $19.511 trillion<br/>04. Japan � $5.606 trillion<br/>05. Indonesia � $5.424 trillion<br/>06. Russia � $4.736 trillion<br/>07. Germany � $4.707 trillion<br/>08. Brazil � $4.439 trillion<br/>09. Mexico � $3.661 trillion<br/>10. United Kingdom � $3.638 trillion<br/>11. France � $3.377 trillion<br/>12. Turkey � $2.996 trillion<br/>13. Saudi Arabia � $2.755 trillion<br/>14. South Korea � $2.651 trillion<br/>15. Italy � $2.541 trillion<br/>16. Iran � $2.354 trillion<br/>17. Spain � $2.159 trillion<br/>18. Canada � $2.141 trillion<br/>19. Egypt � $2.049 trillion<br/>20. Pakistan � $1.868 trillion<br/>21. Nigeria � $1.794 trillion<br/>22. Thailand � $1.732 trillion<br/>23. Australia � $1.663 trillion<br/>24. Philippines � $1.615 trillion<br/>25. Malaysia � $1.506 trillion<br/>26. Poland � $1.505 trillion<br/>27. Argentina � $1.342 trillion<br/>28. Bangladesh � $1.324 trillion<br/>29. Vietnam � $1.303 trillion<br/>30. South Africa � $1.148 trillion<br/>31. Colombia � $1.111 trillion<br/>32. Netherlands � $1.08 trillionimg alt="""" src=""https://www.thenews.com.pk/assets/front/tiny_mce/source/PWCchartweb.jpg"" width=""100%""/
'''

def html_format_article(html_content):
    html_content = html_content.replace('strong>', '<strong>').replace('</strong', '</strong>')
    html_content = html_content.replace('img alt', '<img alt')
    html_content = re.sub(r'""', '"', html_content)
    
    pattern = r'(<img[^>]*)(/)(?!>)'
    html_content = re.sub(pattern, r'\1\2>', html_content)
    
    soup = BeautifulSoup(html_content, 'html.parser')

    content_list = []

    for element in soup.descendants:
        if isinstance(element, str):
            text = element.strip()
            if text:
                content_list.append({'type': 'text', 'content': text})
        elif element.name == 'a':
            content_list.append({
                'type': 'anchor', 
                'link': element.get('href', ''), 
                'text': element.get_text(strip=True)
            })
        elif element.name == 'img':
            content_list.append({
                'type': 'image', 
                'src': element.get('src', ''), 
                'alt': element.get('alt', '')
            })

    for item in content_list:
        print(item)
    
    return content_list

def format_article(articles: list[dict]):
    new_content = ''
    for index, element in enumerate(articles):
        if element['type'] == 'text':
            new_content += text(element)
        elif element['type'] == 'image':
            new_content += image(element)
        elif element['type'] == 'anchor':
            new_content += anchor(element)
        if index < len(articles)-1: new_content += ','

    return '{"type":"doc","content":[CONTENT]}'.replace('CONTENT', new_content)

# qa = {
#     "type":"doc",
#     "content":
#         [
#             {"type":"paragraph","content":[{"type":"text","text":"hello"}]},
#             {"type":"paragraph","content":[{"type":"text","text":"hello"}]},
#             {"type":"paragraph","content":[{"type":"text","text":"asdasdasd asdasds"}]},
#             {"type":"paragraph","content":[{"type":"text","marks":[{"type":"link","attrs":{"href":"https://stackoverflow.com/questions/4105956/regex-does-not-contain-certain-characters","target":"_blank","rel":"noopener noreferrer nofollow","class":"text-muted-foreground underline underline-offset-[3px] hover:text-primary transition-colors cursor-pointer"}}],"text":"link"}]},
#             {"type":"image","attrs":{"src":"https://brnx9rsmvjqlixb6.public.blob.vercel-storage.com/image-u1djVUMBzREWkovqUvwLsrC1zFfRm8.png","alt":null,"title":null,"width":null,"height":null}}
#         ]
# }

def text(text: str):
    return '{"type":"paragraph","content":[{"type":"text","text":"TEXT"}]}'.replace('TEXT', text['content'].replace('"', '\\"'))

def image(image: dict):
    return '{"type":"image","attrs":{"src":"SRC" ,"alt":"ALT" ,"title":"" ,"width":null,"height":null}}'.replace('SRC', image['src']).replace('ALT', image['alt'])

def anchor(link: dict):
    return '{"type":"paragraph","content":[{"type":"text","marks":[{"type":"link","attrs":{"href":"LINK","target":"_blank","rel":"noopener noreferrer nofollow","class":"text-muted-foreground underline underline-offset-[3px] hover:text-primary transition-colors cursor-pointer"}}],"text":"TEXT"}]}'.replace('LINK', link['link']).replace('TEXT', link['text'])
article_list = html_format_article(html_content)
article_formatted_text = format_article(article_list)

print(article_formatted_text)