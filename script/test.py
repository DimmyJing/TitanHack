from html.parser import HTMLParser
import requests


addresses = []
valid_address = True


class MyHTMLParser(HTMLParser):
    def handle_starttag(self, tag, attrs):
        global valid_address
        valid_address = (len(attrs) == 1 and len(attrs[0]) == 2
                         and attrs[0][1] == "address1")

    def handle_data(self, data):
        if valid_address:
            data = ''.join(data.strip().split("ï»¿"))
            if data:
                addresses.append(data)


parser = MyHTMLParser()


def get_disposal(coor):
    global addresses
    addresses = []
    longitude, latitude, material = coor.split(':')
    url = ("https://search.earth911.com/"
           f"?what={material}"
           "&list_filter=location"
           "&max_distance=25"
           f"&latitude={latitude}"
           f"&longitude={longitude}")
    resp = requests.get(url).text
    parser.feed(resp)
    return addresses[0]


print(get_disposal("-96.76718079999999:33.066188800000006:plastic"))
